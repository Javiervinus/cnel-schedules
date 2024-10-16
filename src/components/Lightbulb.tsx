import type { DetallePlanificacion } from "@/interfaces/schedule-response";
import { LightbulbOff, Lightbulb as LightbulbOn } from "lucide-react";

interface Props {
  currentCut: DetallePlanificacion | null;
}

export default function Lightbulb({ currentCut }: Props) {
  return <>{currentCut ? <LightbulbOff color="red" /> : <LightbulbOn />}</>;
}
