import { useEffect, useState } from "react";

import type { ScheduleResponse } from "@/interfaces/schedule-response";
import { IdType } from "../constants/idTypes";
import useLocalStorage from "./hooks/useLocalStorage";
import IdTypeSelect from "./IdTypeSelect";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function FormSchedule() {
  const [idValue, setIdValue] = useLocalStorage<string>("idValue", "");
  const [idType, setIdType] = useLocalStorage<IdType>("idType", IdType.Ci);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Identificación"
          value={idValue}
          onChange={(e) => setIdValue(e.target.value)}
          required
        />
        <IdTypeSelect idType={idType} setIdType={setIdType} />
        <Button type="submit" disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </Button>
      </form>
      {error && <p className="text-red-600">{error}</p>}
    </>
  );
}
