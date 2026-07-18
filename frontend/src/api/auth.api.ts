import { apiRequest } from "./client";

export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role:
    | "SYSTEM_ADMIN"
    | "SALES_MANAGER"
    | "SALES_REP"
    | "ACCOUNT_MANAGER"
    | "EXECUTIVE_VIEWER"
    | "READ_ONLY";
  isActive: boolean;
};

export type LoginResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};

export function login(payload: { email: string; password: string }) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: payload
  });
}

export function getCurrentUser(token: string) {
  return apiRequest<AuthUser>("/auth/me", {
    token
  });
}
