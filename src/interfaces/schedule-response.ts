import type { GroupedPlanificacion } from "./grouped-planification";

export interface ScheduleResponse {
  resp: string;
  mensaje?: string;
  mensajeError?: string;
  extra?: string;
  notificaciones?: Notificacion[];
}

export interface Notificacion {
  idUnidadNegocios: number;
  cuentaContrato: string;
  alimentador: string;
  cuen: string;
  direccion: string;
  fechaRegistro: string;
  detallePlanificacion?: DetallePlanificacion[];
  groupedPlanificacion?: GroupedPlanificacion[];
}

export interface DetallePlanificacion {
  alimentador: string;
  fechaCorte: string;
  horaDesde: string;
  horaHasta: string;
  comentario?: string;
  fechaRegistro: string;
  fechaHoraCorte: string;
  cutDateFrom?: Date;
  cutDateTo?: Date;
}
