import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const adminBackendTarget = (env.VITE_ADMIN_PROXY_TARGET || 'http://127.0.0.1:8000').replace(/\/+$/, '')
  const customerBackendTarget = (env.VITE_CUSTOMER_PROXY_TARGET || 'http://127.0.0.1:8001').replace(/\/+$/, '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/v1/customer': {
          target: customerBackendTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/api': {
          target: adminBackendTarget,
          changeOrigin: true,
        },
        '/health': {
          target: adminBackendTarget,
          changeOrigin: true,
        },
        '/uploads': {
          target: adminBackendTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
