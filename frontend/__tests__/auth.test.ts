import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../lib/auth/session";

describe("Authentication Utility Tests", () => {
  it("should securely hash password and verify matching hash", async () => {
    const rawPassword = "AdminPassword123!";
    const hash = await hashPassword(rawPassword);

    expect(hash).not.toBe(rawPassword);
    const isValid = await verifyPassword(rawPassword, hash);
    expect(isValid).toBe(true);
  });

  it("should reject incorrect password against hash", async () => {
    const rawPassword = "AdminPassword123!";
    const wrongPassword = "WrongPassword456!";
    const hash = await hashPassword(rawPassword);

    const isValid = await verifyPassword(wrongPassword, hash);
    expect(isValid).toBe(false);
  });
});
