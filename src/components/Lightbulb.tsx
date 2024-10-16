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
          {currentCut ? <LightbulbOff color="red" /> : <LightbulbOn />}
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
                  {currentCut.horaHasta}. Quedan
                  <relative-time
                    lang="es"
                    datetime={currentCut.cutDateTo?.toISOString()}
                  ></relative-time>
                  minutos para que vuelva la electricidad… si todo va según lo
                  planeado
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
        {currentCut ? <LightbulbOff color="red" /> : <LightbulbOn />}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you're done.
          </DrawerDescription>
        </DrawerHeader>
        asdasd
        {/* <ProfileForm className="px-4" /> */}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
