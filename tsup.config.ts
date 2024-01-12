import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  clean: true,
  format: ["cjs", "esm"],
  target: "es2022",
  dts: true,
});
