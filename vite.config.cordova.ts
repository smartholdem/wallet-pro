import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import rollupNodePolyFill from "rollup-plugin-polyfill-node";
import { version } from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./", // Set base for relative paths in Cordova
    define: {
        "__APP_VERSION__": JSON.stringify(version),
    },
    plugins: [vue(), vueJsx()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    optimizeDeps: {
        exclude: ["vue-demi"],
        esbuildOptions: {
            define: {
                global: "globalThis",
            },
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true,
                    process: true,
                }),
            ],
        },
    },
    build: {
        outDir: 'src-cordova/www', // Output to Cordova's www directory
        emptyOutDir: true,
        rollupOptions: {
            plugins: [rollupNodePolyFill()],
        },
    },
});
