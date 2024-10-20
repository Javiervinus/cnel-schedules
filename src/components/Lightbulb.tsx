import type { DetallePlanificacion } from "@/interfaces/schedule-response";
import { LightbulbOff, Lightbulb as LightbulbOn } from "lucide-react";
import { useState } from "react";
import useMediaQuery from "./hooks/useMediaQuery";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

interface Props {
  currentCut: DetallePlanificacion | null;
}

export default function Lightbulb({ currentCut }: Props) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-3"
            aria-label="Ver detalles del corte"
          >
            {currentCut ? (
              <>
                <LightbulbOff color="red" />
                <span className="sr-only">
                  Ver detalles del corte (sin luz)
                </span>
              </>
            ) : (
              <>
                <LightbulbOn />
                <span className="sr-only">
                  Ver detalles del corte (con luz)
                </span>
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentCut
                ? "Posiblemente sin luz 🤡"
                : "Posiblemente con luz 💡"}
            </DialogTitle>
            <DialogDescription>
              {currentCut ? (
                <span>
                  ¡Parece que no tienes luz! El corte empezó a las{" "}
                  {currentCut.horaDesde} y terminará a las{" "}
                  {currentCut.horaHasta}. La electricidad debería volver en{" "}
                  <relative-time
                    lang="es"
                    tense="future"
                    threshold="P0S"
                    className="ml-1"
                    format="duration"
                    precision="minute"
                    datetime={currentCut.cutDateTo?.toISOString()}
                  ></relative-time>
                  … si todo va según lo planeado.
                </span>
              ) : (
                <span>
                  Los horarios de CNEL EP no siempre son exactos. Podrías tener
                  luz… o quizá no. ¡Mejor prepárate por si acaso!
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* <ProfileForm /> */}
        </DialogContent>
      </Dialog>
    );
  }
  //   return <>

  //   {currentCut ?

  //   <LightbulbOff color="red" /> : <LightbulbOn />}

  //   </>;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-3"
          aria-label="Ver detalles del corte"
        >
          {currentCut ? (
            <>
              <LightbulbOff color="red" />
              <span className="sr-only">Ver detalles del corte (sin luz)</span>
            </>
          ) : (
            <>
              <LightbulbOn />
              <span className="sr-only">Ver detalles del corte (con luz)</span>
            </>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            {currentCut ? "Posiblemente sin luz 🤡" : "Posiblemente con luz 💡"}
          </DrawerTitle>
          <DrawerDescription>
            {currentCut ? (
              <span>
                ¡Parece que no tienes luz! El corte empezó a las{" "}
                {currentCut.horaDesde} y terminará a las {currentCut.horaHasta}.
                La electricidad debería volver en{" "}
                <relative-time
                  lang="es"
                  tense="future"
                  threshold="P0S"
                  className="ml-1"
                  format="duration"
                  precision="minute"
                  datetime={currentCut.cutDateTo?.toISOString()}
                ></relative-time>
                … si todo va según lo planeado.
              </span>
            ) : (
              <span>
                Los horarios de CNEL EP no siempre son exactos. Podrías tener
                luz… o quizá no. ¡Mejor prepárate por si acaso!
              </span>
            )}
          </DrawerDescription>
        </DrawerHeader>

        {/* <ProfileForm className="px-4" /> */}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Ok</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
