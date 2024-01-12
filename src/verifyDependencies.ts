import type { Providers } from "./Providers";
import { assertNoCircularDeps } from "./assertNoCircularDeps";
import { assertNoMissingProviders } from "./assertNoMissingProviders";
import { mapValues } from "./mapValues";
import { parseDependencyNames } from "./parseDependencyNames";

export const verifyDependencies = (providers: Providers) => {
  const graph = mapValues(providers, parseDependencyNames);
  assertNoCircularDeps(graph);
  assertNoMissingProviders(graph);
};
