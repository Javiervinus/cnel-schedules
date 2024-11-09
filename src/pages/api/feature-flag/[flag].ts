// import type { FeatureFlagEnum } from "@/enums/feature-flag.enum";
// import { getFeatureFlag } from "@/utils/feature-flags";
// import type { APIRoute } from "astro";

// export const GET: APIRoute = async ({ params, cookies }) => {
//   const featureCookies = cookies.get("vercel-flag-overrides")?.value;

//   if (!params.flag) {
//     return new Response(JSON.stringify(null), { status: 400 });
//   }

//   const flagValue = await getFeatureFlag(
//     params.flag as FeatureFlagEnum,
//     featureCookies
//   );

//   return new Response(JSON.stringify(flagValue ?? null), {
//     headers: { "Content-Type": "application/json" },
//   });
// };

// src/pages/api/feature-flag/[flag].ts
export const prerender = false;

import {
  featureFlags,
  type FeatureFlagName,
} from "@/config/feature-flags/definition";
import type { FeatureFlagResponse } from "@/types/api";
import { getFeatureFlag } from "@/utils/feature-flags";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, cookies }) => {
  const flagName = params.flag as FeatureFlagName;

  if (!flagName || !(flagName in featureFlags)) {
    return new Response(JSON.stringify({ error: "Invalid flag name" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const featureCookies = cookies.get("vercel-flag-overrides")?.value;
  console.log("🚀 ~ constGET:APIRoute= ~ featureCookies:", featureCookies);

  const flagValue = await getFeatureFlag(flagName, featureCookies);

  const responseBody: FeatureFlagResponse<typeof flagName> = {
    value: flagValue,
  };

  return new Response(JSON.stringify(responseBody), {
    headers: { "Content-Type": "application/json" },
  });
};
