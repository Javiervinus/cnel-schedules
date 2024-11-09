// src/config/feature-flags/types.ts

// Tipo genérico para las opciones de las feature flags
export type FeatureFlagOption<T> = {
  value: T;
  label: string;
};

// Tipo genérico para una definición de feature flag
export type FeatureFlagDefinition<T> = {
  description: string;
  defaultValue: T;
  options: FeatureFlagOption<T>[];
};

// Tipos para los nombres y valores de las feature flags (se completan en definitions.ts)
export type FeatureFlagName = string;
export type FeatureFlagValue<K extends FeatureFlagName> = any;
