import type { GroupedPlanificacion } from "@/interfaces/grouped-planification";
import type { DetallePlanificacion } from "@/interfaces/schedule-response";

export function getTotalHours(values: DetallePlanificacion[]): number {
  return values.reduce((acc, value) => {
    const start = value.horaDesde.split(":");
    const end = value.horaHasta.split(":");
    const startHour = parseInt(start[0], 10);
    const startMinute = parseInt(start[1], 10);
    let endHour = parseInt(end[0], 10);
    const endMinute = parseInt(end[1], 10);

    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date();
    // Si el fin es a medianoche "00:00", lo ajustamos a las 24 horas
    if (endHour === 0 && endMinute === 0) {
      endHour = 24;
    }

    // Si la hora de fin es menor que la de inicio, significa que cruza la medianoche
    if (endHour < startHour) {
      endDate.setDate(endDate.getDate() + 1); // Avanzar un día
    }

    endDate.setHours(endHour, endMinute, 0, 0);

    const diff = endDate.getTime() - startDate.getTime();
    const hours = diff / (1000 * 60 * 60);

    return acc + hours;
  }, 0);
}
export function getNearestCutDate(groupedValues: GroupedPlanificacion[]) {
  const now = new Date();

  // Mapea todas las fechas de corte incluyendo horaDesde y crea Date objects
  const upcomingCuts = groupedValues.flatMap((group) =>
    group.values.map((value) => {
      const [hora, minuto] = value.horaDesde.split(":").map(Number);
      const cutDate = new Date(group.date); // Usamos la fecha original
      cutDate.setHours(hora, minuto, 0, 0); // Ajustamos las horas del corte
      return value;
    })
  );

  // Filtra solo las fechas de corte que son futuras
  const futureCuts = upcomingCuts.filter(
    (detail) => detail?.cutDateFrom! > now
  );

  // Si no hay cortes futuros, devuelve null
  if (futureCuts.length === 0) return null;

  // Encuentra el corte más cercano
  const nearestCut = futureCuts.reduce((nearest, cutDate) => {
    return cutDate < nearest ? cutDate : nearest;
  });

  // nearestCut.setHours(nearestCut.getHours() - 6, 0, 0);
  // Devuelve la fecha y hora del corte más cercano
  return nearestCut;
}

export function isCurrentCut(
  now: Date,
  groupedValues: GroupedPlanificacion[]
): DetallePlanificacion | null {
  // Itera sobre los valores agrupados
  for (const group of groupedValues) {
    for (const value of group.values) {
      // Asegúrate de que existan las fechas de corte
      if (value.cutDateFrom && value.cutDateTo) {
        // Comprueba si la fecha actual está dentro del rango de corte
        if (now >= value.cutDateFrom && now <= value.cutDateTo) {
          return value; // Devuelve el detalle si se encuentra dentro de un corte
        }
      }
    }
  }

  // Si no se encuentra ningún corte en progreso, devuelve null
  return null;
}
