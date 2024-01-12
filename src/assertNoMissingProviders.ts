export const assertNoMissingProviders = (
  providers: Record<string, readonly string[]>
) => {
  for (const [provider, dependencies] of Object.entries(providers)) {
    for (const dependency of dependencies) {
      if (!(dependency in providers)) {
        throw new Error(
          `Provider "${dependency}" not defined, required by provider "${provider}"`
        );
      }
    }
  }
};
