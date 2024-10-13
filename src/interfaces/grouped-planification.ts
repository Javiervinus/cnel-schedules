import type { DetallePlanificacion } from "./schedule-response";

export interface GroupedPlanificacion {
  fechaCorte: string;
  date: Date;
  values: DetallePlanificacion[];
}
