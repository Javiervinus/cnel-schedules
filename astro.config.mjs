// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";
// import vercel from "@astrojs/vercel/static";

import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://cnel-schedules.vercel.app",
  // output: "static",
  // adapter: vercel({
  //   webAnalytics: { enabled: true },
  // }),
  integrations: [tailwind({
    applyBaseStyles: false,
  }), react(), sitemap(), icon()],
});