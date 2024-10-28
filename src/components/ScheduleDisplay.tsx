import type { ScheduleResponse } from "@/interfaces/schedule-response";
import { AlertCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import ScheduleCard from "./ScheduleCard";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

interface ScheduleDisplayProps {
  error: string | null;
  errorCnelep: boolean;
  lastSuccess: string | null;
  schedule: ScheduleResponse | null;
}

const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({
  error,
  errorCnelep,
  lastSuccess,
  schedule,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (schedule) {
      setIsVisible(true);
    }
  }, [schedule]);

  return (
    <section
      className={`w-full collapsible ${schedule || error ? "expanded" : ""}`}
    >
      <div className="flex flex-col gap-2 mb-2">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="text-red-500">
              {errorCnelep ? "Servicio no disponible" : "Error"}
            </AlertTitle>
            <AlertDescription className="dark:text-white text-red-500">
              {error}
            </AlertDescription>
          </Alert>
        )}
        {lastSuccess && (
          <Badge variant="secondary" className="text-sm">
            {errorCnelep ? (
              <span>
                La información mostrada abajo es la última disponible antes de
                la caída del servicio de CNEL, que fue{" "}
                <relative-time
                  datetime={lastSuccess!}
                  format="relative"
                  precision="minute"
                  lang="es"
                ></relative-time>
                .
              </span>
            ) : (
              <span>
                Última actualización:{" "}
                <relative-time
                  datetime={lastSuccess!}
                  lang="es"
                ></relative-time>
              </span>
            )}
          </Badge>
        )}
      </div>
      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full md:hidden block"
      >
        <CarouselContent>
          {schedule?.notificaciones?.map((notification, index) => (
            <CarouselItem
              key={index}
              className={`${
                schedule.notificaciones?.length! > 1
                  ? "basis-[86%]"
                  : "basis-[100%]"
              } `}
            >
              <ScheduleCard notification={notification} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <section className="md:grid grid-cols-1 gap-4 hidden">
        {schedule?.notificaciones?.map((notification, index) => (
          <ScheduleCard key={index} notification={notification} />
        ))}
      </section>
    </section>
  );
};

export default ScheduleDisplay;
