import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'public': path.resolve(__dirname, './public')
        }
    },
    css: {
        preprocessorOptions: {
            stylus: {
                // Add any stylus options here if needed
            }
        }
    },
    build: {
        outDir: 'dist/client',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html')
            }
        }
    },
})
