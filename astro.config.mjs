// @ts-check
import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import sitemap from '@astrojs/sitemap'
import vercel from '@astrojs/vercel'

// https://astro.build
export default defineConfig({
  site: 'https://www.portugalrealestateforsale.com',
  // Static by default — every content page is prerendered to HTML at build time.
  // The single /api/subscribe route opts into on-demand rendering via `export const prerender = false`.
  output: 'static',
  adapter: vercel(),
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
})
