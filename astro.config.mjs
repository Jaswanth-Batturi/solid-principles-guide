// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://jaswanth-batturi.github.io',
  base: '/solid-principles-guide',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
