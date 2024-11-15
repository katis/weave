import { describe, it, expect } from 'vitest';
import { Provider, isClassProvider } from './Providers';

describe('Provider mixin', () => {
  it('should work with a class extending from Provider() without a base class', () => {
    class TestClassWithoutBase extends Provider() {
      constructor() {
        super();
        this.value = 42;
      }
      value: number;
    }

    const instanceWithoutBase = new TestClassWithoutBase();
    expect(instanceWithoutBase.value).toBe(42);
    expect(isClassProvider(TestClassWithoutBase)).toBe(true);
  });

  it('should work with a class extending from Provider() with a base class', () => {
    class BaseClass {
      baseValue: number;
      constructor() {
        this.baseValue = 100;
      }
    }

    class TestClassWithBase extends Provider(BaseClass) {
      constructor() {
        super();
        this.value = 42;
      }
      value: number;
    }

    const instanceWithBase = new TestClassWithBase();
    expect(instanceWithBase.value).toBe(42);
    expect(instanceWithBase.baseValue).toBe(100);
    expect(isClassProvider(TestClassWithBase)).toBe(true);
  });
});
