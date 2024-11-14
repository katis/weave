const classProvider: unique symbol = Symbol("weave.classProvider");

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
): provider is ClassProvider<any, any> => classProvider in provider;

export type HasClassProvider = {
  readonly [classProvider]: true;
};

export function Provider<B extends new (...args: any[]) => any>(
  Base: B
): B & HasClassProvider;
export function Provider(): (new () => object) & HasClassProvider;
export function Provider(base: new (...args: any[]) => any = Object): any {
  return class Injectable extends base {
    static get [classProvider]() {
      return true;
    }
  };
}
