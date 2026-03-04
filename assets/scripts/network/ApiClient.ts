import { API_BASE_URL } from "../core/Config";
import type { IUser } from "../model/UserModel";
import type { AuthResponse, LeaderboardItem, PlayResult } from "../types/ApiTypes";

const DEFAULT_TIMEOUT_MS = 10000;

export class ApiClient {
  public static async auth(initData: string): Promise<IUser> {
    const response = await this.requestWithApiFallback<unknown>("/auth", {
      method: "POST",
      body: JSON.stringify({ initData }),
    });

    const wrapped = response as { user?: unknown } | null;
    if (wrapped?.user) {
      return this.normalizeUser(wrapped.user);
    }

    return this.normalizeUser(response);
  }

  public static async play(): Promise<PlayResult> {
    const response = await this.requestWithApiFallback<unknown>("/play", {
      method: "POST",
    });

    const wrapped = response as { result?: unknown } | null;
    const payload = wrapped?.result ?? response;
    return this.normalizePlayResult(payload);
  }

  public static async getLeaderboard(): Promise<LeaderboardItem[]> {
    const response = await this.requestWithApiFallback<unknown>("/leaderboard", {
      method: "GET",
    });

    if (Array.isArray(response)) {
      return response.map((item) => this.normalizeLeaderboardItem(item));
    }

    const wrapped = response as { leaderboard?: unknown[] } | null;
    const list = wrapped?.leaderboard ?? [];
    return Array.isArray(list) ? list.map((item) => this.normalizeLeaderboardItem(item)) : [];
  }

  private static async requestWithApiFallback<T>(path: string, init: RequestInit): Promise<T> {
    try {
      return await this.request<T>(path, init);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      // Vercel serverless default routes are /api/*.
      if (message.startsWith("HTTP 404")) {
        return this.request<T>(`/api${path}`, init);
      }
      throw error;
    }
  }

  private static async request<T>(path: string, init: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          ...(init.headers || {}),
        },
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${errorText || "Request failed"}`);
      }

      try {
        return (await response.json()) as T;
      } catch {
        throw new Error("Failed to parse JSON response");
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout");
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private static normalizeUser(raw: unknown): IUser {
    const item = (raw ?? {}) as Record<string, unknown>;
    return {
      userId: String(item.userId ?? item.id ?? ""),
      username: String(item.username ?? item.name ?? "Player"),
      score: Number(item.score ?? 0),
      totalGames: Number(item.totalGames ?? item.gamesPlayed ?? 0),
      winCount: Number(item.winCount ?? 0),
    };
  }

  private static normalizeLeaderboardItem(raw: unknown): LeaderboardItem {
    const item = (raw ?? {}) as Record<string, unknown>;
    return {
      userId: String(item.userId ?? item.id ?? ""),
      username: String(item.username ?? item.name ?? "Player"),
      score: Number(item.score ?? 0),
      rank: Number(item.rank ?? 0),
    };
  }

  private static normalizePlayResult(raw: unknown): PlayResult {
    const item = (raw ?? {}) as Record<string, unknown>;

    if (Array.isArray(item.ranks)) {
      return {
        ranks: item.ranks.map((n) => Number(n)),
        winner: Number(item.winner ?? (item.ranks as unknown[])[0] ?? 1),
        rank: Number(item.rank ?? 1),
        reward: Number(item.reward ?? 0),
        newScore: Number(item.newScore ?? 0),
      };
    }

    const horses = Array.isArray(item.horses) ? item.horses as Array<Record<string, unknown>> : [];
    const ranks = horses
      .slice()
      .sort((a, b) => Number(a.position ?? 0) - Number(b.position ?? 0))
      .map((h) => Number(h.id ?? 0))
      .filter((id) => Number.isFinite(id) && id > 0);
    const player = (item.player ?? {}) as Record<string, unknown>;

    return {
      ranks,
      winner: ranks[0] ?? 1,
      rank: Number(player.position ?? 1),
      reward: Number(player.reward ?? player.coins ?? 0),
      newScore: Number(player.newScore ?? player.coins ?? 0),
    };
  }
}
