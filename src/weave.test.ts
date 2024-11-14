import { describe, expect, it, vi } from "vitest";
import { weave } from "./weave";
import { Provider } from "./Providers";

describe("weave", () => {
  const a = ({ b, c }: { b: (prefix: string) => string; c: string }) =>
    `A(${b("B")}, ${c})`;

  const b =
    ({ c, d }: { c: string; d: number }) =>
    (prefix: string) =>
      `${prefix}(${c}, ${d})`;

  const c = () => "C";
  const d = () => 12;

  class E extends Provider() {
    constructor({a, b}: {a: string; b: (prefix: string) => string, d: number}) {
      super()
    }
  }

  const fullProviders = weave({ a, b, c, d, e:E  });

  it("builds all dependencies", () => {
    expect({
      a: fullProviders.a,
      b: fullProviders.b("B"),
      c: fullProviders.c,
      d: fullProviders.d,
      e: fullProviders.e
    }).toEqual({
      a: "A(B(C, 12), C)",
      b: "B(C, 12)",
      c: "C",
      d: 12,
      e: expect.any(E)
    });
  });

  it("shows missing dependency names in the missing-property type", () => {
    // @ts-expect-error missing dependencies b and c
    expect(() => weave({ a, d })).toThrow();
  });

  it("shows missing dependency names in the missing-property type", () => {
    // @ts-expect-error missing dependencies b and c
    expect(() => weave({ a, e: E })).toThrow();
  });

  it("shows error for wrong dependency return type", () => {
    const a = ({ b }: { b: string }) => `A(${b})`;
    // @ts-expect-error wrong dependency return type for b
    weave({ a, b: () => 12 });
  });
});
