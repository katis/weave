import { describe, expect, it, vi } from "vitest";
import { resolved } from "./resolved";

describe("resolved", () => {
  const c = vi.fn();
  const deps = resolved({
    a: ({ b, d }: any) => ({ b, d }),
    b: () => "b",
    c: () => c(),
    d: () => "d",
  });

  it("creates an object requiring dependencies", () => {
    expect(deps.a).toEqual({ b: "b", d: "d" });
  });

  it("doesn't call the unused dependencies", () => {
    const _ = deps.a;
    expect(c).not.toHaveBeenCalled();
  });
});
