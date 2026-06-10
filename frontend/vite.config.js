import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api/auth': {
        target: 'http://localhost:8081', // Apunta al puerto expuesto de Docker
        changeOrigin: true,
      },
      '/api/usuarios': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/api/catalogo': {
        target: 'http://localhost:8082',
        changeOrigin: true,
      },
      '/api/pedidos': {
        target: 'http://localhost:8083',
        changeOrigin: true,
      }
    }
  }
})