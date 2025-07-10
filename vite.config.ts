import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption, loadEnv } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables based on mode (development, production)
  const env = loadEnv(mode, process.cwd());
  
  return {
    base: '/tripplanner-pro/',
    plugins: [
      react(),
      tailwindcss(),
      // DO NOT REMOVE
      createIconImportProxy() as PluginOption,
      sparkPlugin() as PluginOption,
    ],
    resolve: {
      alias: {
        '@': resolve(projectRoot, 'src')
      }
    },
    // Add these to replace environment variables in index.html
    define: {
      'import.meta.env.VITE_GOOGLE_MAPS_API_KEY': JSON.stringify(env.VITE_GOOGLE_MAPS_API_KEY || '')
    },
  };
});
