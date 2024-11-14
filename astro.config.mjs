// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import { loadEnv } from "vite"; // Importa loadEnv de Vite

import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import icon from "astro-icon";

// Carga las variables de entorno
const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  site: "https://cnel-schedules.vercel.app",
  output: "server",

  adapter: vercel({
    isr: {
      bypassToken: env.BYPASS_TOKEN_CACHE, // Cambiado para usar env
      expiration: 60 * 60 * 24, // 24 horas
      exclude: ["/server-islands/[...slug]", "/_server-islands/[...slug]"],
    },
  }),

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap({
      customPages: await getBlogPostUrls(env), // Pasando env aquí
    }),
    icon(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
});
/**
 * @param {Record<string, string>} env - Environment variables
 */
async function getBlogPostUrls(env) {
  const contentful = await import("contentful");
  const contentfulClient = contentful.createClient({
    space: env.CONTENTFUL_SPACE_ID,
    environment: env.CONTENTFUL_ENVIRONMENT,
    accessToken:
      env.NODE_ENV === "development"
        ? env.CONTENTFUL_PREVIEW_TOKEN
        : env.CONTENTFUL_DELIVERY_TOKEN,
    host:
      env.NODE_ENV === "development"
        ? "preview.contentful.com"
        : "cdn.contentful.com",
  });

  const entries = await contentfulClient.getEntries({
    content_type: "blogPost",
    select: ["fields.slug"],
  });

  return entries.items.map(
    (post) => `https://cnel-schedules.vercel.app/blog/${post.fields.slug}`
  );
}
