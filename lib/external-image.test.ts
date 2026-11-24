import { describe, expect, it } from "vitest";

import { isPublicAddress, parseExternalImageUrl } from "./external-image";

describe("external recipe image migration safeguards", () => {
  it("accepts only HTTPS URLs without embedded credentials or custom ports", () => {
    expect(parseExternalImageUrl("https://example.com/food.jpg").hostname).toBe(
      "example.com",
    );
    expect(() => parseExternalImageUrl("http://example.com/food.jpg")).toThrow(
      "public HTTPS",
    );
    expect(() =>
      parseExternalImageUrl("https://user:pass@example.com/food.jpg"),
    ).toThrow("public HTTPS");
    expect(() =>
      parseExternalImageUrl("https://example.com:8443/food.jpg"),
    ).toThrow("public HTTPS");
  });

  it("rejects non-public IP destinations", () => {
    expect(isPublicAddress("93.184.216.34")).toBe(true);
    expect(isPublicAddress("127.0.0.1")).toBe(false);
    expect(isPublicAddress("10.0.0.5")).toBe(false);
    expect(isPublicAddress("169.254.169.254")).toBe(false);
    expect(isPublicAddress("::1")).toBe(false);
    expect(isPublicAddress("::ffff:127.0.0.1")).toBe(false);
  });
});
