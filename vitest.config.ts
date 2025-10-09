import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    exclude: ["node_modules", "dist", "e2e", "**/node_modules/**", "**/dist/**", "**/e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: [
        "src/services/stomp/**",
        "src/hooks/stomp/**",
        "src/errors/stomp-*.ts",
        "src/utils/stomp/**",
        "src/constants/stomp-*.ts",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
