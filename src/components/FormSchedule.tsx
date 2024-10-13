import { useEffect, useState } from "react";

import type {
  DetallePlanificacion,
  ScheduleResponse,
} from "@/interfaces/schedule-response";
import { AlertCircle } from "lucide-react";
import { IdType } from "../constants/idTypes";
import useLocalStorage from "./hooks/useLocalStorage";
import IdTypeSelect from "./IdTypeSelect";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { GroupedPlanificacion } from "@/interfaces/grouped-planification";
import { parseDateString } from "@/lib/utils";
import ScheduleCard from "./ScheduleCard";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";

export default function FormSchedule() {
  const [idValue, setIdValue] = useLocalStorage<string>("idValue", "");
  const [idType, setIdType] = useLocalStorage<IdType>("idType", IdType.Ci);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const now = new Date();

  function mapResponse(data: ScheduleResponse): ScheduleResponse {
    const mappedData = data.notificaciones?.map((notificacion) => {
      const groupedPlanificacion = groupByFechaCorte(
        notificacion.detallePlanificacion ?? []
      );
      return {
        ...notificacion,
        groupedPlanificacion,
      };
    });

    return {
      ...data,
      notificaciones: mappedData,
    };
  }

  function groupByFechaCorte(
    detallePlanificacion: DetallePlanificacion[]
  ): GroupedPlanificacion[] {
    const map = new Map<string, GroupedPlanificacion>();

    for (const item of detallePlanificacion) {
      const { fechaCorte, fechaHoraCorte } = item;

      // Parse the date using fechaHoraCorte
      const date = parseDateString(fechaHoraCorte);

      if (!map.has(fechaCorte)) {
        map.set(fechaCorte, {
          fechaCorte,
          date,
          values: [item],
        });
      } else {
        map.get(fechaCorte)!.values.push(item);
      }
    }

    // Convert the Map to an array and sort by date
    return Array.from(map.values()).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
  }
  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    setLoading(true);
    try {
      // Guardar en localStorage
      setIdValue(idValue);
      setIdType(idType);

      // https://api.cnelep.gob.ec/servicios-linea/v1/notificaciones/consultar/0913193074/IDENTIFICACION

      // Hacer la petición HTTP
      const response = await fetch(
        `https://api.cnelep.gob.ec/servicios-linea/v1/notificaciones/consultar/${idValue}/${idType}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = (await response.json()) as ScheduleResponse;
      if (data.resp === "ERROR") {
        setError(data.mensaje ?? "Error al buscar los horarios");
        return;
      } else {
        setSchedule(mapResponse(data));
        setError(null);
      }

      console.log("Response:", data);
    } catch (error) {
      console.error("Error during search request:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idValue !== "" && idType) {
      handleSubmit();
    }
  }, []);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-2 w-full"
      >
        <Input
          className="col-span-2"
          placeholder="Identificación"
          value={idValue}
          onChange={(e) => setIdValue(e.target.value)}
          required
        />
        <div className="col-span-2">
          <IdTypeSelect idType={idType} setIdType={setIdType} />
        </div>

        <Button
          className="col-span-1"
          type="submit"
          disabled={loading || idValue === ""}
        >
          {loading ? "Buscando..." : "Buscar"}
        </Button>
      </form>
      <section className="mt-4">
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error}. Por favor, intenta de nuevo.
            </AlertDescription>
          </Alert>
        ) : (
          <>
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
                        ? "basis-[85%]"
                        : "basis-[100%]"
                    } `}
                  >
                    <ScheduleCard notification={notification} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* <CarouselPrevious />
            <CarouselNext /> */}
            </Carousel>

            <section className="md:grid grid-cols-1 gap-4 hidden ">
              {schedule?.notificaciones?.map((notification, index) => (
                <ScheduleCard notification={notification} />
              ))}
            </section>
          </>
        )}
      </section>
    </>
  );
}
