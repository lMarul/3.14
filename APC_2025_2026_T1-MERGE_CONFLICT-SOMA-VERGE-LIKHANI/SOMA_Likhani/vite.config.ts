import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      {
        // Alias @ to the src directory
        find: '@',
        replacement: path.resolve(__dirname, './src'),
      },
      {
        // Replace the exported APC logo placeholder with a real local logo asset.
        find: 'figma:asset/17fb449f5f8c6600256e2bce222094b5c3395da0.png',
        replacement: path.resolve(__dirname, './src/assets/apc-logo.svg'),
      },
      {
        // Map Figma export asset scheme to a local fallback asset URL.
        find: /^figma:asset\/.*$/,
        replacement: path.resolve(__dirname, './src/figmaAssetFallback.ts'),
      },
    ],
  },
  server: {
    port: 5173,
    allowedHosts: [
      'imprudent-compacted-unadvised.ngrok-free.dev',
      'imprudent-compacted-unadvised.ngrok-free.app'
    ]
  }
})



