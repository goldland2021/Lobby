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
export const TRACK_START_X = -420;
export const TRACK_END_X = 420;
export const HORSE_COUNT = 6;
export const BASE_FINISH_TIME = 4.5;
