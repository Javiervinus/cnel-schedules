// src/utils/api-client.ts

import type {
  FeatureFlagName,
  FeatureFlagValue,
} from "@/config/feature-flags/definition";
import type { AllFeatureFlagsResponse, FeatureFlagResponse } from "@/types/api";

const isServer = typeof window === "undefined";

export async function fetchFeatureFlag<K extends FeatureFlagName>(
  flagName: K,
  baseUrl?: string,
  headers?: HeadersInit
): Promise<FeatureFlagValue<K>> {
  const url =
    isServer && baseUrl
      ? `${baseUrl}/api/feature-flag/${flagName}`
      : `/api/feature-flag/${flagName}`;

  const response = await fetch(url, {
    headers,
    credentials: "include", // Por si es necesario en el cliente
  });

  if (!response.ok) {
    throw new Error(`Error fetching feature flag: ${flagName}`);
  }
  const data = (await response.json()) as FeatureFlagResponse<K>;
  console.log("🚀 ~ data:", data);

  return data.value;
}

export async function fetchAllFeatureFlags(
  baseUrl?: string,
  headers?: HeadersInit
): Promise<AllFeatureFlagsResponse> {
  const url =
    isServer && baseUrl ? `${baseUrl}/api/feature-flags` : `/api/feature-flags`;

  const response = await fetch(url, {
    headers,
    credentials: "include", // Por si es necesario en el cliente
  });

  if (!response.ok) {
    throw new Error("Error fetching feature flags");
  }
  return (await response.json()) as AllFeatureFlagsResponse;
}
