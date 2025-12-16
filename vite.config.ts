import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
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
        manifest: true,
        ssrManifest: true,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html')
            }
        }
    },
    ssr: {
        noExternal: ['firebase']
    }
})
