import {fileURLToPath, URL} from "url";

import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import {NodeGlobalsPolyfillPlugin} from "@esbuild-plugins/node-globals-polyfill";
import rollupNodePolyFill from "rollup-plugin-polyfill-node";
import {version} from "./package.json";

// https://vitejs.dev/config/
export default defineConfig({
    //base: "./", //electron
    // base: "/", // process.env.NODE_ENV === "production" ? "/wallet/" : "/", // for gh-pages
    define: {
        "__APP_VERSION__": JSON.stringify(version),
        'IS_EXTENSION': 'false',
    },
    plugins: [vue(), vueJsx()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
            //process: "process/browser",
            //zlib: "browserify-zlib",
            //util: "util",
        },
    },
    optimizeDeps: {
        exclude: ["vue-demi"],
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: "globalThis",
            },
            // Enable esbuild polyfill plugins
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    buffer: true,
                    process: true,
                }),
            ],
        },
    },
    build: {
        rollupOptions: {
            plugins: [rollupNodePolyFill()],
        },
    },
});