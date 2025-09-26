import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        libInjectCss()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    build: {
        lib: {
            // Entry point of your library
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'VsDataTable',
            // Will output: vs-datatable.es.js, vs-datatable.umd.js
            fileName: (format) => `vs-datatable.${format}.js`,
        },
        rollupOptions: {
            // Do not bundle Vue — expect it as a peer dependency
            external: ['vue'],
            output: {
                exports: 'named', // prevent named+default warning
                globals: {
                    vue: 'Vue', // for UMD build
                },
            },
        },
        cssCodeSplit: false,
    },
});
