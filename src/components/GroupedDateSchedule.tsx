import type { GroupedPlanificacion } from "@/interfaces/grouped-planification";
import type {
  DetallePlanificacion,
  Notificacion,
} from "@/interfaces/schedule-response";
import { getTotalHours } from "@/lib/cut.utils";
import {
  capitalizeFirstLetter,
  formatDate,
  handleShareAsImage,
} from "@/lib/utils";
import { Share } from "lucide-react";
import { useRef } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
interface Props {
  detail: GroupedPlanificacion;
  notification: Notificacion;
  nearestCutDate: DetallePlanificacion | null;
}

export default function GroupedDateSchedule({
  detail,
  notification,
  nearestCutDate,
}: Props) {
  const now = new Date();
  const hiddenContentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Card className=" shadow-none relative">
        <CardHeader>
          <CardTitle>
            {capitalizeFirstLetter(formatDate(detail.date))}
            {detail.date.toDateString() === now.toDateString() && (
              <Badge
                className="absolute bottom-0 justify-center left-0 w-full"
                variant="secondary"
              >
                Hoy
              </Badge>
            )}

            <Button
              className="absolute right-2 top-3"
              variant="ghost"
              size="icon"
              aria-label="Compartir horario de corte"
              onClick={() =>
                handleShareAsImage({
                  hiddenContentRef,
                  title: `Horario CNEL`,
                  text: `Horario de corte del ${formatDate(detail.date)}`,
                  fileName: `horario-corte-${formatDate(
                    detail.date,
                    false
                  )}.png`,
                })
              }
            >
              <Share size={16} strokeWidth={0.7}></Share>
              <span className="sr-only">Compartir</span>
            </Button>
          </CardTitle>
          <CardDescription>
            {detail.values.length} horarios por {getTotalHours(detail.values)}{" "}
            horas
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-1 gap-y-2 md:gap-x-2 md:gap-y-2">
          {detail.values.map((value, index) => (
            <Badge
              key={`schedule-${index}`}
              variant={"outline"}
              className={`text-sm px-0 md:px-2.5       ${
                nearestCutDate?.cutDateFrom?.toISOString() ===
                value.cutDateFrom?.toISOString()
                  ? "border-destructive text-destructive dark:text-white"
                  : ""
              }`}
            >
              <span className=" flex-grow text-center ">
                {value.horaDesde}-{value.horaHasta}
              </span>
            </Badge>
          ))}
        </CardContent>
      </Card>
      <div
        style={{
          position: "absolute",
          top: "-9999px",
          left: "-9999px",
          width: "1500px !important",
          height: "500px !important",
          zoom: "0.5 !important",
        }}
        className="force-light-mode flex p-10 " // Aplicamos la clase para forzar el modo claro en la captura
      >
        <Card
          ref={hiddenContentRef}
          className=" shadow-none relative  border-none"
          style={{ width: "100% !important", zoom: "0.5 !important" }}
        >
          <CardHeader>
            <CardTitle>
              {capitalizeFirstLetter(formatDate(detail.date))}
            </CardTitle>
            <CardDescription>
              {detail.values.length} horarios por {getTotalHours(detail.values)}{" "}
              horas
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-x-2 gap-y-2">
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
      </div>
    </>
  );
}
