import { describe, expect, it, vi } from "vitest";
import { parseDependencyNames } from "./parseDependencyNames";

describe("parseDependencyNames", () => {
  const depNames = ["a", "b", "c", "d"];

  it("should parse arrow function deps", () => {
    const arrow = ({ a, b, c, d: DD }: any) => null;
    expect(parseDependencyNames(arrow)).toEqual(depNames);
  });

  it("should parse named function deps", () => {
    function named({ a, b, c, d: DD }: any) {
      return null;
    }
    expect(parseDependencyNames(named)).toEqual(depNames);
  });

  it("should parse anonymous function deps", () => {
    let anonymousFn = (() =>
      function ({ a, b, c, d: DD }: any) {
        return null;
      })();
    expect(parseDependencyNames(anonymousFn)).toEqual(depNames);
  });

  it("should parse method function deps", () => {
    const { methodFn } = {
      methodFn({ a, b, c, d: DD }: any) {
        return null;
      },
    };
    expect(parseDependencyNames(methodFn)).toEqual(depNames);
  });

  it("should parse method arrow function deps", () => {
    const { methodArrow } = {
      methodArrow: ({ a, b, c, d: DD }: any) => null,
    };
    expect(parseDependencyNames(methodArrow)).toEqual(depNames);
  });

  it("should parse curried arrow function deps", () => {
    const curriedArrow =
      ({ a, b, c, d: DD }: any) =>
      ({ qwer }: any) =>
        null;

    expect(parseDependencyNames(curriedArrow)).toEqual(depNames);
  });
});
