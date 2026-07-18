import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  firstName: z.string().min(1).max(60),
  lastName: z.string().min(1).max(60),
  role: z.enum([
    "SYSTEM_ADMIN",
    "SALES_MANAGER",
    "SALES_REP",
    "ACCOUNT_MANAGER",
    "EXECUTIVE_VIEWER",
    "READ_ONLY"
  ])
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72)
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1)
});
