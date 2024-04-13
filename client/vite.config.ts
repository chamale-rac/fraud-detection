import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import basicSsl from '@vitejs/plugin-basic-ssl'
import tailwindcss from 'tailwindcss'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5000,
  },
  plugins: [
    react(),
    basicSsl({
      name: 'localhost',
      domains: ['localhost'],
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },

  resolve: {
    alias: [
      {
        find: '@Layout',
        replacement: path.resolve(__dirname, 'src/Fragments'),
      },
      {
        find: '@Components',
        replacement: path.resolve(__dirname, 'src/Components'),
      },
      {
        find: '@Utils',
        replacement: path.resolve(__dirname, 'src/utils'),
      },
      {
        find: '@Pages',
        replacement: path.resolve(__dirname, 'src/Pages'),
      },
      {
        find: '@Config',
        replacement: path.resolve(__dirname, 'src/Config'),
      },
      {
        find: '@Api',
        replacement: path.resolve(__dirname, 'src/api'),
      },
      {
        find: '@Stores',
        replacement: path.resolve(__dirname, 'src/Stores'),
      },
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src/@'),
      },
    ],
  },
})
