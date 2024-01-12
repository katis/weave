import type { Providers, Resolved } from "./Providers";
import { mapValues } from "./mapValues";

const property = (provider: (deps: any) => any): PropertyDescriptor => ({
  configurable: false,
  enumerable: true,
  get() {
    return provider(this);
  },
});

export const resolved = <P extends Providers>(providers: P): Resolved<P> =>
  Object.create(Object.prototype, mapValues(providers, property));
