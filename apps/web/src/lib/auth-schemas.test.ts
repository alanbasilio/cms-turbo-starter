import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "./auth-schemas";

describe("loginSchema", () => {
  it("rejects empty identifier or password", () => {
    expect(
      loginSchema.safeParse({ identifier: "", password: "" }).success,
    ).toBe(false);
  });

  it("accepts a filled-in form", () => {
    expect(
      loginSchema.safeParse({ identifier: "alan", password: "secret" }).success,
    ).toBe(true);
  });
});

describe("registerSchema", () => {
  const valid = {
    username: "alan",
    email: "alan@example.com",
    password: "secret1",
    confirmPassword: "secret1",
  };

  it("accepts matching passwords and valid fields", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("flags mismatched passwords on confirmPassword", () => {
    const result = registerSchema.safeParse({
      ...valid,
      confirmPassword: "different",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const onConfirm = result.error.issues.some((issue) =>
        issue.path.includes("confirmPassword"),
      );
      expect(onConfirm).toBe(true);
    }
  });

  it("rejects an invalid email, short username, and short password", () => {
    expect(registerSchema.safeParse({ ...valid, email: "nope" }).success).toBe(
      false,
    );
    expect(registerSchema.safeParse({ ...valid, username: "ab" }).success).toBe(
      false,
    );
    expect(
      registerSchema.safeParse({
        ...valid,
        password: "123",
        confirmPassword: "123",
      }).success,
    ).toBe(false);
  });
});
