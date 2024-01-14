# `@katis/weave` - Functional dependency injection for TypeScript

## Overview

`@katis/weave` is a TypeScript library for automatically resolving dependencies between functions.

## Features

- **Simple providers**: The providers are plain functions making them easy to test.
- **Automatic Dependency Resolution**: `weave` automatically infers and resolves dependencies based on the provided functions.
- **Type Safety**: Ensures dependencies are correctly typed, providing compile-time type checking.
- **Runtime Validation**: Checks for circular or missing dependencies at runtime, throwing exceptions when such issues are detected.
- **Concise Syntax**: Utilizes destructured object syntax for clear and concise dependency declarations.

## Installation

Install the package using your preferred package manager:

```bash
npm install @katis/weave
pnpm add @katis/weave
yarn add @katis/weave
```

## Usage

### Defining Providers

Providers are functions that optionally take a single argument defining the dependencies required by the returned value.
The provider argument MUST use destructuring syntax, as the argument is used to analyze the dependency graph for circular and missing dependencies at runtime.

Example:

```typescript
type Deps = {
  itemsPath: string;
  readItems: (itemsPath: string) => Promise<string[]>;
};
// getItems is a function that first takes it's dependencies as an argument and
// then returns a function that uses those dependencies to read items from a path.
export const getItems =
  ({ itemsPath, readItems }: Deps) =>
  () => {
    readItems(itemsPath);
  };
```

### Using `weave`

The `weave` function takes an object of providers and resolves their dependencies.

Example:

```ts
import { weave } from "@katis/weave";
import { getItems } from "./getItems";
import fs from "fs/promises";

const readItems =
  () =>
  async (path: string): string[] =>
    JSON.parse(await fs.readFile(path, "utf8"));

const providers = {
  itemsPath: (): string => process.env.ITEMS_PATH!,
  readItems,
  getItems,
};

const dependencyGraph = weave(providers);

dependencyGraph.getItems().then(console.log);
```

If a dependency is required by a provider but it's not present in the providers object it results in a type error.
There are also runtime validations for missing dependencies, but they should not be necessary if strict typing is followed.

### Error Handling

- **Type Mismatch**: Compile-time errors are generated for mismatched and missing dependencies.
- **Missing Dependencies**: `weave` throws an exception if there are missing dependencies.
- **Circular Dependencies**: An exception is also thrown for circular dependencies.

### Limitations

Each time a property is read from the dependency graph, the provider function creating it is evaluated again, as are its transitive dependencies providers. This means that deep dependency chains can do a lot of work if the property is read often. Currently there is no support for caching the provider return values beyond returning a constant value from the provider.

There is no support for scoped dependencies, or automatic disposing of dependencies.

## Inspiration

- Playwright [Test Fixtures](https://playwright.dev/docs/test-fixtures)

# License

Copyright 2024 Joni Katajamäki

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
