import { defineConfig } from 'astro/config';
import svelte from "@astrojs/svelte";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  output: "server",
  integrations: [svelte()],
  adapter: vercel()
});