import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";
import { getApiErrorMessage } from "./api-client";

describe("getApiErrorMessage", () => {
  it("extracts the Strapi error message from an axios error", () => {
    const error = new AxiosError("Request failed");
    error.response = {
      data: { error: { message: "Invalid identifier or password" } },
      status: 400,
      statusText: "Bad Request",
      headers: {},
      config: error.config ?? {},
    } as AxiosError["response"];

    expect(getApiErrorMessage(error)).toBe("Invalid identifier or password");
  });

  it("falls back to the message of a plain Error", () => {
    expect(getApiErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("uses the default fallback for unknown values", () => {
    expect(getApiErrorMessage(null)).toContain("Algo deu errado");
  });
});
