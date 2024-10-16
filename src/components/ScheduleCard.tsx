import type { Notificacion } from "@/interfaces/schedule-response";
import {
  getNearestCutDate,
  getTotalHours,
  isCurrentCut,
} from "@/lib/cut.utils";
import { capitalizeFirstLetter, formatDate } from "@/lib/utils";
import "@github/relative-time-element";
import { useEffect, useState } from "react";
import Lightbulb from "./Lightbulb";
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
  const [nearestCutDate, setNearestCutDate] = useState(
    getNearestCutDate(notification.groupedPlanificacion!)
  );
  const [currentCut, setCurrentCut] = useState(
    isCurrentCut(new Date(), notification.groupedPlanificacion!)
  );
  useEffect(() => {
    setNearestCutDate(getNearestCutDate(notification.groupedPlanificacion!));
    setCurrentCut(isCurrentCut(new Date(), notification.groupedPlanificacion!));
  }, [notification]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setNearestCutDate(getNearestCutDate(notification.groupedPlanificacion!));
      setCurrentCut(isCurrentCut(now, notification.groupedPlanificacion!));
    }, 60000); // Actualiza cada minuto (60000 ms)

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
  }, [notification.groupedPlanificacion]);

  return (
    <Card key={notification.cuentaContrato}>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Contrato {notification.cuentaContrato}</span>
          <span>
            <Lightbulb currentCut={currentCut}></Lightbulb>
          </span>
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          <span className="flex flex-col gap-1">
            <span>Alimentador: {notification.alimentador}</span>
            <span>Dirección: {notification.direccion}</span>
            <span>Código único: {notification.cuen}</span>
            <span>
              <Badge variant="destructive" className="text-md">
                <span className="text-center">
                  <span className="mr-1">Próximo corte en</span>
                  {/* Usamos span en lugar de p */}
                  <span>
                    <relative-time
                      tense="future"
                      threshold="P0S"
                      className="ml-1"
                      lang="es"
                      datetime={nearestCutDate?.cutDateFrom?.toISOString()}
                      format="duration"
                      precision="minute"
                    ></relative-time>
                  </span>
                </span>
              </Badge>
            </span>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <section className="grid gird-cols-2 md:grid-cols-3 gap-3">
          {notification.groupedPlanificacion?.map((detail, index) => (
            <Card
              className=" shadow-none relative"
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
              <CardContent className="grid grid-cols-2 gap-x-1 gap-y-2 md:gap-x-2 md:gap-y-2">
                {detail.values.map((value, index) => (
                  <Badge
                    key={`schedule-${index}`}
                    variant={
                      nearestCutDate?.cutDateFrom?.toISOString() ===
                      value.cutDateFrom?.toISOString()
                        ? "destructive"
                        : "outline"
                    }
                    className="text-sm px-0 md:px-2.5"
                  >
                    <span className=" flex-grow text-center ">
                      {value.horaDesde}-{value.horaHasta}
                    </span>
                  </Badge>
                ))}
              </CardContent>
            </Card>
          ))}
        </section>
      </CardContent>
    </Card>
  );
}
