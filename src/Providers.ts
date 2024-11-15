export type Providers = Record<string, Provider>;

export type Resolved<D extends Providers> = {
  [P in keyof D]: ProviderReturn<D[P]>;
};

export type Provider<D = any, R = any> = FnProvider<D, R> | ClassProvider<D, R>;

export type FnProvider<D, R> = (deps: D) => R;

// prettier-ignore
export type ProviderReturn<P extends Provider> =
  P extends ClassProvider<any, infer R> ? R :
  P extends FnProvider<any, infer R> ? R :
  never;

// prettier-ignore
export type ProviderParam<P extends Provider> =
  P extends ClassProvider<infer D, any> ? D :
  P extends FnProvider<infer D, any> ? D :
  never;

export type ClassProvider<D, R> = HasClassProvider & {
  new (deps: D): R;
};

export const isClassProvider = (
  provider: Provider
): provider is ClassProvider<any, any> =>
  "isClassProvider" in provider && provider.isClassProvider;

export type HasClassProvider = {
  readonly isClassProvider: true;
};

/**
 * Mixin that allows a class to be used as a Provider with `weave`,
 * takes a base class parameter that the returned class will inherit from
 */
export function Provider<B extends new (...args: any[]) => any>(
  Base: B
): B & HasClassProvider;
/** Mixin that allows a class to be used as a Provider with `weave` */
export function Provider(): (new () => object) & HasClassProvider;
export function Provider(base: new (...args: any[]) => any = Object): any {
  return class Injectable extends base {
    static get isClassProvider() {
      return true;
    }
  };
}
