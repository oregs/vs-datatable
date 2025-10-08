import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
export default defineConfig({
    plugins: [
        vue(),
        libInjectCss()
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            'plugins': fileURLToPath(new URL('./plugins', import.meta.url))
        },
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'VsDataTable',
            fileName: (format) => `vs-datatable.${format}.js`,
        },
        rollupOptions: {
            external: ['vue'],
            output: {
                exports: 'named',
                globals: {
                    vue: 'Vue',
                },
            },
        },
        cssCodeSplit: true,
        emptyOutDir: true,
    },
});
