function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function resolveApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("api_base_url");
  if (fromQuery) {
    return normalizeBaseUrl(fromQuery);
  }

  const fromStorage = window.localStorage.getItem("api_base_url");
  if (fromStorage) {
    return normalizeBaseUrl(fromStorage);
  }

  const fromGlobal = (window as Window & { __API_BASE_URL?: string }).__API_BASE_URL;
  if (fromGlobal) {
    return normalizeBaseUrl(fromGlobal);
  }

  // Default to same-origin API when frontend and backend are deployed together.
  return normalizeBaseUrl(window.location.origin);
}

export const API_BASE_URL = resolveApiBaseUrl();
export const TRACK_START_X = -250;
export const TRACK_END_X = 250;
export const HORSE_COUNT = 6;
export const BASE_FINISH_TIME = 10;
export const PLAYER_HORSE_ID = 0;
export const PLAYER_BASE_SPEED = 0.072;
export const PLAYER_MAX_MOMENTUM = 1.35;
export const PLAYER_TAP_MOMENTUM = 0.12;
export const PLAYER_MOMENTUM_DECAY = 0.88;
export const PLAYER_SPEED_PER_MOMENTUM = 0.085;
export const AI_BASE_SPEED_MIN = 0.066;
export const AI_BASE_SPEED_MAX = 0.09;
export const AI_BURST_MIN = 0.01;
export const AI_BURST_MAX = 0.025;
export const AI_BURST_DECAY = 0.02;
