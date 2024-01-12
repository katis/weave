import { describe, expect, it, vi } from "vitest";
import { verifyDependencies } from "./verifyDependencies";

describe("verifyDependencies", () => {
  it("detects direct circular dependencies", () => {
    const a = ({ b }: { b: string }) => `A(${b})`;
    const b = ({ a }: { a: string }) => `B(${a})`;

    expect(() => verifyDependencies({ a, b })).toThrow(
      "Circular dependency detected: a"
    );
  });

  it("detects indirect circular dependencies", () => {
    const a = ({ b }: { b: string }) => `A(${b})`;
    const b = ({ c }: { c: string }) => `B(${c})`;
    const c = ({ a }: { a: string }) => `C(${a})`;

    expect(() => verifyDependencies({ a, b, c })).toThrow(
      "Circular dependency detected: a -> b -> c -> a"
    );
  });

  it("detects circular dependency to self", () => {
    const a = ({ a }: { a: string }) => `A(${a})`;

    expect(() => verifyDependencies({ a })).toThrow(
      "Circular dependency detected: a -> a"
    );
  });

  it("doesn't throw on no-dependencies", () => {
    const a = () => `A`;

    expect(verifyDependencies({ a })).toBeUndefined();
  });
});
