import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://naufalyoo.github.io',
  base: '/PORTOFOLIO',
  publicDir: './public',
  output: 'static',
  integrations: [
    sitemap({
      filter: () => true,
      customPages: [
        'https://naufalyoo.github.io/PORTOFOLIO/',
        'https://naufalyoo.github.io/PORTOFOLIO/blog/',
        'https://naufalyoo.github.io/PORTOFOLIO/blog/belajar-subnetting-dengan-packet-tracer/',
        'https://naufalyoo.github.io/PORTOFOLIO/blog/proyek-arduino-ldr-pertama/',
        'https://naufalyoo.github.io/PORTOFOLIO/blog/kenapa-saya-milih-tkj/',
      ]
    })
  ],
  build: {
    assets: '_astro'
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    }
  }
});
