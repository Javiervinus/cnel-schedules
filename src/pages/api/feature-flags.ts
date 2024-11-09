// src/pages/api/feature-flags.ts
export const prerender = false;

import { getFeatureFlag } from "@/utils/feature-flags";
import type { APIRoute } from "astro";

import {
  featureFlags,
  type FeatureFlagName,
  type FeatureFlagValue,
} from "@/config/feature-flags/definition";
import type { AllFeatureFlagsResponse } from "@/types/api";

export const GET: APIRoute = async ({ cookies }) => {
  const featureCookies = cookies.get("vercel-flag-overrides")?.value;

  const flags = await Promise.all(
    (Object.keys(featureFlags) as FeatureFlagName[]).map(async (flagName) => {
      const value = await getFeatureFlag(flagName, featureCookies);
      return [flagName, value] as [
        FeatureFlagName,
        FeatureFlagValue<typeof flagName>
      ];
    })
  );

  const flagsObject = Object.fromEntries(flags) as AllFeatureFlagsResponse;

  return new Response(JSON.stringify(flagsObject), {
    headers: { "Content-Type": "application/json" },
  });
};
