import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "./app.js";

describe("app health", () => {
  it("responds with ok status", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
  });
});
