#!/bin/bash

cd "/Users/arundurai/Public/SandyWorks/mitos Webapp/admin"

# Create Vite config
cat > vite.config.js << 'VITEEOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3002,
  },
})
VITEEOF

# Create Tailwind config
cat > tailwind.config.js << 'TAILEOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#35095E',
        secondary: '#51216E',
        text: '#282C35',
      },
    },
  },
  plugins: [],
}
TAILEOF

# Create PostCSS config
cat > postcss.config.js << 'POSTEOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
POSTEOF

# Update index.html
cat > index.html << 'HTMLEOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Admin Dashboard - Mitos</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/turn.js/4.1.0/turn.min.js"></script>
  </body>
</html>
HTMLEOF

echo "Configuration files created!"
