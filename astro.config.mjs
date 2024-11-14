// @ts-check
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");

/**
 * Obtiene las URLs del blog desde Contentful.
 * @param {Record<string, string>} env - Variables de entorno
 * @returns {Promise<string[]>} - Promesa que resuelve a un array de URLs
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
  const urls = entries.items.map(
    (post) => `https://cnel-schedules.vercel.app/blog/${post.fields.slug}`
  );

  return urls;
}

// Obtiene las URLs antes de exportar la configuración
const blogUrlsPromise = getBlogPostUrls(env);

export default blogUrlsPromise.then((blogUrls) =>
  defineConfig({
    site: "https://cnel-schedules.vercel.app",
    adapter: vercel(),
    integrations: [
      tailwind({
        applyBaseStyles: false,
      }),
      react(),
      sitemap({
        customPages: blogUrls,
      }),
      icon(),
      partytown({
        config: {
          forward: ["dataLayer.push"],
        },
      }),
    ],
  })
);
