import crypto from "node:crypto";

import type { Role } from "@prisma/client";

import { prisma } from "../../db/prisma.js";
import { AppError } from "../../shared/errors/AppError.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../shared/utils/jwt.js";
import { hashPassword, verifyPassword } from "../../shared/utils/password.js";

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function toPublicUser(user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
}) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    isActive: user.isActive
  };
}

export class AuthService {
  async register(input: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
  }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (existingUser) {
      throw new AppError("Email is already in use", 409, "EMAIL_ALREADY_IN_USE");
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        role: input.role
      }
    });

    return toPublicUser(user);
  }

  async login(input: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: input.email }
    });

    if (!user || !user.isActive) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const passwordMatches = await verifyPassword(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
    }

    const refreshTokenId = crypto.randomUUID();
    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role
    });
    const refreshToken = signRefreshToken({
      sub: user.id,
      tokenId: refreshTokenId
    });

    await prisma.refreshToken.create({
      data: {
        id: refreshTokenId,
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return {
      user: toPublicUser(user),
      accessToken,
      refreshToken
    };
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    const existingToken = await prisma.refreshToken.findUnique({
      where: { id: payload.tokenId }
    });

    if (!existingToken || existingToken.revokedAt || existingToken.expiresAt < new Date()) {
      throw new AppError("Refresh token is invalid", 401, "INVALID_REFRESH_TOKEN");
    }

    if (existingToken.tokenHash !== hashToken(refreshToken)) {
      throw new AppError("Refresh token is invalid", 401, "INVALID_REFRESH_TOKEN");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub }
    });

    if (!user || !user.isActive) {
      throw new AppError("User no longer exists", 401, "USER_NOT_FOUND");
    }

    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role
    });

    return {
      accessToken,
      user: toPublicUser(user)
    };
  }

  async logout(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);

    await prisma.refreshToken.updateMany({
      where: {
        id: payload.tokenId,
        revokedAt: null
      },
      data: {
        revokedAt: new Date()
      }
    });
  }

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    return toPublicUser(user);
  }
}

export const authService = new AuthService();
