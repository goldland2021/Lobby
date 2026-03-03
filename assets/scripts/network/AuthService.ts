import type { IUser } from "../model/UserModel";
import { ApiClient } from "./ApiClient";

const TELEGRAM_SDK_URL = "https://telegram.org/js/telegram-web-app.js?60";
const TELEGRAM_SDK_TIMEOUT_MS = 6000;

interface ITelegramWebApp {
  initData?: string;
  version?: string;
  ready?: () => void;
  expand?: () => void;
  disableVerticalSwipes?: () => void;
  BackButton?: {
    hide?: () => void;
  };
}

interface ITelegram {
  WebApp?: ITelegramWebApp;
}

export class AuthService {
  public static async authenticate(debugInitData?: string): Promise<IUser> {
    const webApp = await this.ensureTelegramWebApp();

    if (webApp) {
      webApp.ready?.();
      webApp.expand?.();
      if (this.supportsVersion(webApp.version, "7.7")) {
        webApp.disableVerticalSwipes?.();
      }
      if (this.supportsVersion(webApp.version, "6.1")) {
        webApp.BackButton?.hide?.();
      }

      const initData = webApp.initData ?? "";
      if (!initData) {
        throw new Error("Telegram initData is empty");
      }
      return ApiClient.auth(initData);
    }

    if (debugInitData) {
      return ApiClient.auth(debugInitData);
    }

    throw new Error("Telegram WebApp SDK not found");
  }

  private static async ensureTelegramWebApp(): Promise<ITelegramWebApp | null> {
    const existing = (window as Window & { Telegram?: ITelegram }).Telegram?.WebApp;
    if (existing) {
      return existing;
    }

    if (!document?.head) {
      return null;
    }

    let script = document.querySelector(`script[src^="${TELEGRAM_SDK_URL.split("?")[0]}"]`) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.src = TELEGRAM_SDK_URL;
      script.async = true;
      document.head.appendChild(script);
    }

    await new Promise<void>((resolve) => {
      let done = false;
      const finish = (): void => {
        if (done) return;
        done = true;
        resolve();
      };

      const timeoutId = window.setTimeout(finish, TELEGRAM_SDK_TIMEOUT_MS);
      script!.addEventListener("load", () => {
        window.clearTimeout(timeoutId);
        finish();
      });
      script!.addEventListener("error", () => {
        window.clearTimeout(timeoutId);
        finish();
      });
    });

    return (window as Window & { Telegram?: ITelegram }).Telegram?.WebApp ?? null;
  }

  private static supportsVersion(current: string | undefined, minimum: string): boolean {
    if (!current) {
      return false;
    }
    const a = current.split(".").map((n) => Number(n) || 0);
    const b = minimum.split(".").map((n) => Number(n) || 0);
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i += 1) {
      const av = a[i] ?? 0;
      const bv = b[i] ?? 0;
      if (av > bv) return true;
      if (av < bv) return false;
    }
    return true;
  }
}
