import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            "/api/v1": {
                target: "http://localhost:8080",
                changeOrigin: true,
                secure: false
            }
        }
    },

    build: {
        sourcemap: false
    },

    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@assets': path.resolve(__dirname, './src/assets'),
            'src': path.resolve(__dirname, './src')
        }
    },

    define: {
        global: 'globalThis',
    }
});
