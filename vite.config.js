import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Relative asset paths. A GitHub Pages project site is served from a
  // subfolder (username.github.io/repo-name/), so the default absolute '/'
  // would point every script and stylesheet at the domain root and the page
  // would load blank. './' works there and locally without naming the repo,
  // so renaming the repo never breaks the build.
  base: './',

  server: { port: 5180 },
})
