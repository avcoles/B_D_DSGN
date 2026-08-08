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

  server: {
    // Take the port the harness assigns via PORT, so a second session can run
    // this alongside one that already holds 5180. Pinning it here was what made
    // the port a hard requirement rather than a preference.
    port: process.env.PORT ? Number(process.env.PORT) : 5180,
  },
})
