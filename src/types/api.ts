// src/types/api.ts

// src/types/api.ts

// src/types/api.ts
// src/types/api.ts
import type {
  FeatureFlagName,
  FeatureFlagValue,
} from "@/config/feature-flags/definition";

export type FeatureFlagResponse<K extends FeatureFlagName> = {
  value: FeatureFlagValue<K>;
};

export type AllFeatureFlagsResponse = {
  [K in FeatureFlagName]: FeatureFlagValue<K>;
};
