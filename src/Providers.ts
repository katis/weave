export type Providers = Record<string, (deps: any) => any>;

export type Resolved<D extends Providers> = {
  [P in keyof D]: ReturnType<D[P]>;
};
