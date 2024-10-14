import { useEffect, useRef, useState } from "react";

import type {
  DetallePlanificacion,
  ScheduleResponse,
} from "@/interfaces/schedule-response";
import { AlertCircle, X } from "lucide-react";
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
  const [idValue, setIdValue] = useLocalStorage<string>("idValue", "", false);
  const [idType, setIdType] = useLocalStorage<IdType>("idType", IdType.Ci);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Creamos la referencia

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
  const handleSubmit = async (
    event?: React.FormEvent,
    idValueEntered?: string,
    idTypeEntered?: IdType
  ) => {
    event?.preventDefault();
    setLoading(true);
    try {
      // Guardar en localStorage
      const requestIdValue = idValueEntered ?? idValue;
      const requestIdType = idTypeEntered ?? idType;

      setIdValue(requestIdValue, true);
      setIdType(requestIdType);

      // https://api.cnelep.gob.ec/servicios-linea/v1/notificaciones/consultar/0913193074/IDENTIFICACION

      // Hacer la petición HTTP
      const response = await fetch(
        `https://api.cnelep.gob.ec/servicios-linea/v1/notificaciones/consultar/${requestIdValue}/${requestIdType}`
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
  const handleClear = () => {
    setIdValue("", false); // Limpiamos el valor
    inputRef.current?.focus(); // Enfocamos el input
  };
  // Función handleFocus definida fuera del useEffect
  const handleFocus = () => {
    const idValueEntered = JSON.parse(localStorage.getItem("idValue") ?? "");
    const idTypeEntered = JSON.parse(localStorage.getItem("idType") ?? "");

    if (
      idValueEntered &&
      idValueEntered !== "" &&
      idTypeEntered &&
      idTypeEntered !== "" &&
      !loading &&
      !error
    ) {
      handleSubmit(undefined, idValueEntered, idTypeEntered as IdType);
    }
  };

  // Efecto para manejar el foco de la ventana
  useEffect(() => {
    window.addEventListener("focus", handleFocus);

    // Limpia el listener cuando el componente se desmonta
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []); // Se vuelve a suscribir si cambian idValue o idType

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-5 gap-2 w-full"
      >
        <div className="col-span-2 relative">
          <Input
            ref={inputRef}
            placeholder="Identificación"
            value={idValue}
            onChange={(e) => setIdValue(e.target.value, true)} // No guardar en localStorage en el onChange
            required
          />
          <Button
            type="button"
            variant="ghost"
            className="absolute right-0 top-0"
            onClick={handleClear}
          >
            <X size={16} strokeWidth={0.7}></X>
          </Button>
        </div>
        <div className="col-span-2">
          <IdTypeSelect idType={idType} setIdType={setIdType} />
        </div>

        <Button
          className="col-span-2 md:col-span-1 w-full"
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
                        ? "basis-[86%]"
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
                <ScheduleCard key={index} notification={notification} />
              ))}
            </section>
          </>
        )}
      </section>
    </>
  );
}
