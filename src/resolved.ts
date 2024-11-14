import {
  isClassProvider,
  type Provider,
  type Providers,
  type Resolved,
} from "./Providers";
import { mapValues } from "./mapValues";

const property = (provider: Provider): PropertyDescriptor => {
  let get: () => any;
  if (isClassProvider(provider)) {
    get = function (this: any) {
      return new provider(this);
    };
  } else {
    get = function (this: any) {
      return provider(this);
    };
  }
  return {
    configurable: false,
    enumerable: true,
    get,
  };
};

export const resolved = <P extends Providers>(providers: P): Resolved<P> =>
  Object.create(Object.prototype, mapValues(providers, property));
