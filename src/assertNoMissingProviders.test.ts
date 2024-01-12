import { describe, expect, it } from "vitest";
import { assertNoMissingProviders } from "./assertNoMissingProviders";

describe("assertNoMissingProviders", () => {
  it("throws an error when a dependency is missing", () => {
    const providers = {
      foo: ["bar"],
    };

    expect(() => {
      assertNoMissingProviders(providers);
    }).toThrowError('Provider "bar" not defined, required by provider "foo"');
  });

  it("does not throw an error when all dependencies are present", () => {
    const providers = {
      foo: ["bar"],
      bar: [],
    };

    expect(() => {
      assertNoMissingProviders(providers);
    }).not.toThrow();
  });

  it("handles empty dependencies", () => {
    const providers = {
      foo: [],
    };

    expect(() => {
      assertNoMissingProviders(providers);
    }).not.toThrow();
  });
});
