// // utils.ts
// import type { FeatureFlagEnum } from "@/enums/feature-flag.enum";
// import { decrypt } from "@vercel/flags";

// export async function getFeatureFlag<T>(
//   flag: FeatureFlagEnum,
//   cookieValue: string | undefined
// ): Promise<T | undefined> {
//   let decryptedFlags: any = {};
//   if (cookieValue) {
//     decryptedFlags = (await decrypt(
//       cookieValue,
//       import.meta.env.FLAGS_SECRET
//     )) as Record<string, T>;
//   }
//   return decryptedFlags[flag];
// }

// src/utils/feature-flags.ts

import {
  featureFlags,
  type FeatureFlagName,
  type FeatureFlagValue,
} from "@/config/feature-flags/definition";
import { decrypt } from "@vercel/flags";

export async function getFeatureFlag<K extends FeatureFlagName>(
  flag: K,
  cookieValue: string | undefined
): Promise<FeatureFlagValue<K>> {
  let decryptedFlags: Partial<Record<FeatureFlagName, any>> = {};
  if (cookieValue) {
    decryptedFlags = (await decrypt(
      cookieValue,
      import.meta.env.FLAGS_SECRET
    )) as Partial<Record<FeatureFlagName, any>>;
  }

  const value = decryptedFlags[flag];
  if (value !== undefined) {
    return value as FeatureFlagValue<K>;
  }

  return featureFlags[flag].defaultValue;
}
