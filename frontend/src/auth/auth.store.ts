import { create } from "zustand";

import type { AuthUser } from "../api/auth.api";

type AuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (session: { user: AuthUser; accessToken: string; refreshToken: string }) => void;
  clearSession: () => void;
};

const STORAGE_KEY = "lightweight-crm-auth";

function readStoredSession() {
  if (typeof window === "undefined") {
    return {
      user: null,
      accessToken: null,
      refreshToken: null
    };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return {
      user: null,
      accessToken: null,
      refreshToken: null
    };
  }

  return JSON.parse(raw) as Pick<AuthState, "user" | "accessToken" | "refreshToken">;
}

export const useAuthStore = create<AuthState>((set) => ({
  ...readStoredSession(),
  setSession: ({ user, accessToken, refreshToken }) => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        user,
        accessToken,
        refreshToken
      })
    );

    set({
      user,
      accessToken,
      refreshToken
    });
  },
  clearSession: () => {
    window.localStorage.removeItem(STORAGE_KEY);
    set({
      user: null,
      accessToken: null,
      refreshToken: null
    });
  }
}));
