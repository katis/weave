export const mapValues = <A, B>(
  record: Record<string, A>,
  fn: (value: A) => B
): Record<string, B> =>
  Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, fn(value)])
  );
