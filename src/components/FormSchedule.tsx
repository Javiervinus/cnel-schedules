import { useEffect, useRef, useState } from "react";

import type {
  DetallePlanificacion,
  ScheduleResponse,
} from "@/interfaces/schedule-response";
import { Search, X } from "lucide-react";
import { IdType } from "../constants/idTypes";
import useLocalStorage from "./hooks/useLocalStorage";
import IdTypeSelect from "./IdTypeSelect";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

import type { GroupedPlanificacion } from "@/interfaces/grouped-planification";
import { parseDateString } from "@/lib/utils";
import ScheduleDisplay from "./ScheduleDisplay";
import Spinner from "./SpinnerLoading";

export default function FormSchedule() {
  const [idValue, setIdValue] = useLocalStorage<string>("idValue", "", true);
  const [idType, setIdType] = useLocalStorage<IdType>("idType", IdType.Ci);
  const [idValueLoaded, setIdValueLoaded] = useState(false);
  const [backUpIdValue, setBackUpIdValue] = useLocalStorage<string | null>(
    "backUpIdValue",
    null
  );
  const [lastSuccess, setLastSuccess] = useLocalStorage<string | null>(
    "lastSuccess",
    null
  );
  const [backUpSchedule, setBackUpSchedule] =
    useLocalStorage<ScheduleResponse | null>("backUpSchedule", null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCnelep, setErrorCnelep] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Creamos la referencia
  const initialRender = useRef(true);

  // Efecto para detectar cuando `idValue` ha sido actualizado desde `localStorage`
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Solo ejecutamos este código en el cliente
      setIdValueLoaded(true);
    }
  }, []);
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    // Si `idValue` ha sido cargado y no está vacío, ejecutamos `handleSubmit`
    if (idValueLoaded && idValue !== "") {
      handleSubmit();
    }
  }, [idValueLoaded]);

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
      const dateFrom = parseDateString(fechaHoraCorte);
      const dateTo = new Date(dateFrom);
      const [hourFrom, minuteFrom] = item.horaDesde.split(":").map(Number);
      let [hourTo, minuteTo] = item.horaHasta.split(":").map(Number);
      dateFrom.setHours(hourFrom, minuteFrom, 0, 0);

      item.cutDateFrom = dateFrom;

      if (hourTo == 0) {
        hourTo = 24;
      }
      dateTo.setHours(hourTo, minuteTo, 0, 0);
      item.cutDateTo = dateTo;

      if (!map.has(fechaCorte)) {
        map.set(fechaCorte, {
          fechaCorte,
          date: dateFrom,
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
    setErrorCnelep(false);
    setError(null);

    try {
      // Guardar en localStorage
      const requestIdValue = idValueEntered ?? idValue;
      const requestIdType = idTypeEntered ?? idType;

      setIdValue(requestIdValue, true);
      setIdType(requestIdType);

      // Crear un controlador para abortar la petición si excede el tiempo de espera
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos

      // Hacer la petición HTTP
      const response = await fetch(
        `https://api.cnelep.gob.ec/servicios-linea/v1/notificaciones/consultar/${requestIdValue}/${requestIdType}`,
        {
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId); // Limpiar el timeout si la petición se completa a tiempo
      if (!response.ok) {
        console.error("Network response was not ok");
        throw new Error("Network response was not ok");
      }
      // Si la petición es exitosa, limpiar el error
      setErrorCnelep(false);

      const data = (await response.json()) as ScheduleResponse;
      if (data.resp === "ERROR") {
        setError(
          data.mensaje ??
            "Error al buscar los horarios" + ". Por favor, intenta de nuevo."
        );
        setSchedule(null);
        return;
      } else {
        setBackUpIdValue(requestIdValue);
        setBackUpSchedule(data);
        setSchedule(mapResponse(data));
        setError(null);
        setLastSuccess(new Date().toISOString());
      }
    } catch (error: any) {
      // Error de CNEL EP
      setError(
        "El Servicio de CNEL EP actualmente no está disponible. Intente más tarde por favor."
      );

      setErrorCnelep(true);

      console.error("Error during search request:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   console.log("idValue", idValue);
  //   console.log("idType", idType);
  //   if (idValue !== "" && idType) {
  //     handleSubmit();
  //   }
  // }, []);

  useEffect(() => {
    if (backUpSchedule && idValue === backUpIdValue) {
      setSchedule(mapResponse(backUpSchedule));
    } else {
      setSchedule(null);
    }
  }, [errorCnelep]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Validate that only numbers are entered
    if (/^\d*$/.test(value)) {
      setIdValue(value, false); // 'false' to not save to localStorage on input change
    }
  };
  const handleClear = () => {
    setIdValue("", false); // Limpiamos el valor
    inputRef.current?.focus(); // Enfocamos el input
  };
  // Función handleFocus definida fuera del useEffect
  const handleFocus = () => {
    const idValueEntered = localStorage.getItem("idValue")
      ? JSON.parse(localStorage.getItem("idValue") as string)
      : null;
    const idTypeEntered = localStorage.getItem("idType")
      ? JSON.parse(localStorage.getItem("idType") as string)
      : null;

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
        className="grid grid-cols-7 md:grid-cols-5 gap-2 w-full"
      >
        <div className="col-span-3 md:col-span-2 relative">
          <Input
            ref={inputRef}
            inputMode="numeric"
            placeholder="Identificación"
            value={idValue}
            pattern="\d*"
            onChange={handleInputChange}
            // No guardar en localStorage en el onChange
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
        <div className="col-span-3 md:col-span-2">
          <IdTypeSelect idType={idType} setIdType={setIdType} />
        </div>

        <Button
          className="col-span-1 md:col-span-1 w-full"
          type="submit"
          disabled={loading || idValue === ""}
        >
          <span className="hidden md:block">
            {loading ? "Buscando..." : "Buscar"}
          </span>
          <span className="block md:hidden">
            {loading ? <Spinner /> : <Search size={15} />}
          </span>
        </Button>
      </form>
      <ScheduleDisplay
        error={error}
        errorCnelep={errorCnelep}
        lastSuccess={lastSuccess}
        schedule={schedule}
      />
    </>
  );
}
