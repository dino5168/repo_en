import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  const menuFile = env.VITE_MENU_CONFIG_FILE ?? 'menu.default.json'
  const menuPath = path.resolve(__dirname, `src/config/menu/${menuFile}`)
  const fallbackPath = path.resolve(__dirname, 'src/config/menu/menu.default.json')

  const menuConfig = JSON.parse(
    fs.readFileSync(fs.existsSync(menuPath) ? menuPath : fallbackPath, 'utf-8')
  )

  return {
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    define: {
      __MENU_CONFIG__: JSON.stringify(menuConfig),
    },
  }
})
