// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";
import vercel from "@astrojs/vercel/serverless";

import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

import partytown from "@astrojs/partytown";

// https://astro.build/config
export default defineConfig({
  site: "https://cnel-schedules.vercel.app",
  output: "hybrid",
  adapter: vercel({
    isr: {
      bypassToken: import.meta.env.BYPASS_TOKEN_CACHE,
      expiration: 10,
    },
    edgeMiddleware: true,
  }),
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap(),
    icon(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
  experimental: {
    serverIslands: true,
  },
});
