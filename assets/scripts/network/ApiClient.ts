import { API_BASE_URL } from "../core/Config";
import type { IUser } from "../model/UserModel";
import type { AuthResponse, LeaderboardItem, PlayResult } from "../types/ApiTypes";

const DEFAULT_TIMEOUT_MS = 10000;

export class ApiClient {
  public static async auth(initData: string): Promise<IUser> {
    const response = await this.request<AuthResponse>("/auth", {
      method: "POST",
      body: JSON.stringify({ initData }),
    });
    return response.user;
  }

  public static async play(): Promise<PlayResult> {
    return this.request<PlayResult>("/play", {
      method: "POST",
    });
  }

  public static async getLeaderboard(): Promise<LeaderboardItem[]> {
    return this.request<LeaderboardItem[]>("/leaderboard", {
      method: "GET",
    });
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
}
