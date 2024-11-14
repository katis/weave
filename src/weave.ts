import type { Provider, ProviderParam, Providers, Resolved } from "./Providers";
import { resolved } from "./resolved";
import { verifyDependencies } from "./verifyDependencies";

export type AllProviderDependencies<
  D extends Record<string, Provider>
> = UnionToIntersection<
  {
    [P in keyof D]: ProviderDependencies<D[P]>;
  }[keyof D]
>;

// prettier-ignore
export type ProviderDependencies<F> =
  F extends () => any ? {} :
  F extends new () => any ? {} :
  F extends (arg: infer A) => any ? A :
  F extends new (arg: infer A) => any ? A :
  never;

type UnionToIntersection<Union> = (
  Union extends any ? (u: Union) => void : never
) extends (i: infer Intersection) => void
  ? Intersection
  : never;

export const weave = <
  P extends _InternalProviders & {
    // Inlined FullyResolved type for more readable error messages
    [K in keyof AllProviderDependencies<_InternalProviders>]: (
      ...args: ProviderParams<_InternalProviders, K>
    ) => AllProviderDependencies<_InternalProviders>[K];
  },
  _InternalProviders extends Providers = P
>(
  providers: P
): Resolved<P> => {
  verifyDependencies(providers);
  return resolved(providers);
};

export type FullyResolved<D extends Providers> = {
  [K in keyof AllProviderDependencies<D>]: (
    arg: any
  ) => AllProviderDependencies<D>[K];
};

export type ProviderParams<P extends Providers, K> = K extends keyof P
  ? [deps: ProviderParam<P[K]>]
  : [deps: unknown];
