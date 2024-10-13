import type { GroupedPlanificacion } from "@/interfaces/grouped-planification";
import type {
  DetallePlanificacion,
  Notificacion,
} from "@/interfaces/schedule-response";
import { capitalizeFirstLetter, formatDate } from "@/lib/utils";
import "@github/relative-time-element";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function ScheduleCard({
  notification,
}: {
  notification: Notificacion;
}) {
  const now = new Date();

  function getTotalHours(values: DetallePlanificacion[]): number {
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
  function getNearestCutDate(
    groupedValues: GroupedPlanificacion[]
  ): Date | null {
    const now = new Date();

    // Mapea todas las fechas de corte incluyendo horaDesde y crea Date objects
    const upcomingCuts = groupedValues.flatMap((group) =>
      group.values.map((value) => {
        const [hora, minuto] = value.horaDesde.split(":").map(Number);
        const cutDate = new Date(group.date); // Usamos la fecha original
        cutDate.setHours(hora, minuto, 0, 0); // Ajustamos las horas del corte
        return cutDate;
      })
    );

    // Filtra solo las fechas de corte que son futuras
    const futureCuts = upcomingCuts.filter((cutDate) => cutDate > now);

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

  return (
    <Card key={notification.cuentaContrato}>
      <CardHeader>
        <CardTitle>Contrato {notification.cuentaContrato}</CardTitle>
        <CardDescription>
          <span className="flex flex-col gap-1">
            <span>Alimentador: {notification.alimentador}</span>
            <span>Dirección: {notification.direccion}</span>
            <span>Número de contrato: {notification.cuen}</span>
            <span>
              <Badge variant="destructive">
                <span className="mr-1">Próximo corte en</span>
                {/* Usamos span en lugar de p */}
                <span>
                  <relative-time
                    tense="future"
                    threshold="P0S"
                    className="ml-1"
                    lang="es"
                    datetime={getNearestCutDate(
                      notification.groupedPlanificacion!
                    )?.toISOString()}
                    format="duration"
                    precision="minute"
                  ></relative-time>
                </span>
              </Badge>
            </span>
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <section className="grid gird-cols-2 md:grid-cols-3 gap-3">
          {notification.groupedPlanificacion?.map((detail, index) => (
            <article
              className="border border-gray-200 rounded relative"
              key={`${notification.cuentaContrato}-${detail.fechaCorte}`}
            >
              <CardHeader>
                <CardTitle>
                  {capitalizeFirstLetter(formatDate(detail.date))}
                  {detail.date.toDateString() === now.toDateString() && (
                    <Badge
                      className="absolute top-0 right-0"
                      variant="secondary"
                    >
                      Hoy
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  {detail.values.length} horarios por{" "}
                  {getTotalHours(detail.values)} horas
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                {detail.values.map((value, index) => (
                  <div
                    className="border flex justify-between"
                    key={`group-${index}`}
                  >
                    <span className="border-r flex-grow text-center">
                      {value.horaDesde}-{value.horaHasta}
                    </span>
                    <span className="text-center flex-none px-0.5">
                      {getTotalHours([value])}
                    </span>
                  </div>
                ))}
              </CardContent>

              {/* {detail.values.map((value, index) => (
              <CardContent key={`group-${index}`}>
                Desde: {value.horaDesde} <br />
                Hasta: {value.horaHasta}
              </CardContent>
            ))} */}
            </article>
          ))}
        </section>
      </CardContent>
    </Card>
  );
}
