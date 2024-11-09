// src/config/feature-flags/definitions.ts

import type { FeatureFlagDefinition } from "./types";

// Definimos nuestras feature flags con sus tipos específicos
export const featureFlags = {
  newScheduleAvailable: {
    description: "Nuevo horario disponible",
    defaultValue: false,
    options: [
      { value: true, label: "Activado" },
      { value: false, label: "Desactivado" },
    ],
  } as FeatureFlagDefinition<boolean>,
};

// Extraemos los tipos para los nombres y valores de las feature flags
export type FeatureFlagName = keyof typeof featureFlags;

export type FeatureFlagValue<K extends FeatureFlagName> =
  (typeof featureFlags)[K]["defaultValue"];
