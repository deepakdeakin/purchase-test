import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",          // DOM for React tests
    setupFiles: ["./src/setupTests.ts"],
    globals: true,                  // make it/expect/describe global
  },
});
