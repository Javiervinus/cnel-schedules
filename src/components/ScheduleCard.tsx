import type { Notificacion } from "@/interfaces/schedule-response";
import {
  getNearestCutDate,
  getTotalHours,
  isCurrentCut,
} from "@/lib/cut.utils";
import { capitalizeFirstLetter, formatDate } from "@/lib/utils";
import { toPng } from "html-to-image";

import "@github/relative-time-element";
import { Share } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Lightbulb from "./Lightbulb";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
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
  const hiddenContentRef = useRef<HTMLDivElement>(null);

  const [nearestCutDate, setNearestCutDate] = useState(
    getNearestCutDate(notification.groupedPlanificacion!)
  );
  const [currentCut, setCurrentCut] = useState(
    isCurrentCut(new Date(), notification.groupedPlanificacion!)
  );
  const [firstDate, setFirstDate] = useState<Date | null>(null);
  const [lastDate, setLastDate] = useState<Date | null>(null);
  const [diffDays, setDiffDays] = useState<number>(0);

  const handleShareAsImage = () => {
    if (hiddenContentRef.current === null) return;

    // Genera la imagen como PNG
    toPng(hiddenContentRef.current)
      .then((dataUrl) => {
        // Convertimos la imagen a Blob
        fetch(dataUrl)
          .then((res) => res.blob())
          .then((blob) => {
            // Verificamos si el navegador soporta la Web Share API
            if (navigator.share) {
              const file = new File([blob], "schedule.png", {
                type: blob.type,
              });
              navigator
                .share({
                  files: [file], // Compartimos la imagen como archivo
                  title: "Horarios de cortes",
                  text: "Aquí tienes los horarios de cortes de luz.",
                })
                .then(() => console.log("Compartido con éxito"))
                .catch((error) => console.error("Error al compartir:", error));
            } else {
              console.error("El navegador no soporta la Web Share API.");
            }
          });
      })
      .catch((error) => {
        console.error("Error al generar la imagen:", error);
      });
  };

  useEffect(() => {
    setNearestCutDate(getNearestCutDate(notification.groupedPlanificacion!));
    setCurrentCut(isCurrentCut(new Date(), notification.groupedPlanificacion!));

    setFirstDate(notification.groupedPlanificacion![0].date);
    setLastDate(
      notification.groupedPlanificacion![
        notification.groupedPlanificacion!.length - 1
      ].date
    );
  }, [notification]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setNearestCutDate(getNearestCutDate(notification.groupedPlanificacion!));
      setCurrentCut(isCurrentCut(now, notification.groupedPlanificacion!));
    }, 60000); // Actualiza cada minuto (60000 ms)

    return () => clearInterval(interval); // Limpia el intervalo cuando el componente se desmonta
  }, [notification.groupedPlanificacion]);

  useEffect(() => {
    if (firstDate && lastDate) {
      const diffTime = Math.abs(lastDate.getTime() - firstDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDiffDays(diffDays);
    }
  }, [firstDate, lastDate]);

  return (
    <Card key={notification.cuentaContrato} className="relative">
      <CardHeader>
        <CardTitle className="flex justify-between mb-3">
          <span>Contrato {notification.cuentaContrato}</span>

          <Lightbulb currentCut={currentCut}></Lightbulb>
        </CardTitle>

        <div className="text-sm text-muted-foreground">
          <span className="flex flex-col gap-1 ">
            <span>Alimentador: {notification.alimentador}</span>
            <span>Dirección: {notification.direccion}</span>
            <span>Código único: {notification.cuen}</span>
            <span className="mt-2">
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
            <Button
              variant="outline"
              onClick={handleShareAsImage}
              className="mt-2"
            >
              <Share className="mr-2" size={15} />
              Compartir horario completo
            </Button>
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <section className="grid gird-cols-2  md:grid-cols-2 lg:grid-cols-3 gap-3">
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

        <section
          style={{
            position: "absolute",
            top: "-9999px",
            left: "-9999px",
            width: "1500px !important",
          }}
        >
          <Card className="w-full" ref={hiddenContentRef}>
            <CardHeader>
              <CardTitle>
                Horarios desde el {formatDate(firstDate, false)} hasta el{" "}
                {formatDate(lastDate, false)}
              </CardTitle>
              <CardDescription>
                Alimentador: {notification.alimentador} <br />
                Sector {notification.direccion}
              </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
              <section
                className="grid grid-cols-3 gap-3 w-full"
                style={{ width: "100%" }}
              >
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
                          variant={"outline"}
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
        </section>
      </CardContent>
    </Card>
  );
}
