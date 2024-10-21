import type { ShareFile } from "@/interfaces/share-file";
import { clsx, type ClassValue } from "clsx";
import { toPng } from "html-to-image";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/**
 * Parses string date in format "YYYY-MM-DD HH:mm:ss" and returns a Date object.
 * @param fechaHoraCorte - The date-time string to parse.
 * @returns A Date object representing the date.
 */
export function parseDateString(dateStr: string): Date {
  // Extract the date part (YYYY-MM-DD) from fechaHoraCorte
  const datePart = dateStr.split(" ")[0];

  // Split the date components
  const [year, month, day] = datePart.split("-").map(Number);

  // Create a new Date object (months are zero-indexed in JavaScript)
  return new Date(year, month - 1, day);
}
export function formatDate(value?: Date | null, weekday = true): string {
  if (!value) {
    return "";
  }
  const date = new Date(value);

  return new Intl.DateTimeFormat("es-ES", {
    weekday: weekday ? "long" : undefined,
    day: "numeric",
    month: "long",
  }).format(date);
}
export function capitalizeFirstLetter(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export const handleShareAsImage = (
  shareFileInfo: ShareFile,
  setIsLoadingImage: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (shareFileInfo.hiddenContentRef.current === null) return;

  // Inicia el estado de carga
  setIsLoadingImage(true);

  // Genera la imagen como PNG
  toPng(shareFileInfo.hiddenContentRef.current)
    .then((dataUrl) => {
      // Convertimos la imagen a Blob
      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          // Verificamos si el navegador soporta la Web Share API
          if (navigator.share) {
            const file = new File([blob], shareFileInfo.fileName, {
              type: blob.type,
            });
            navigator
              .share({
                files: [file], // Compartimos la imagen como archivo
                title: shareFileInfo.title,
                text: shareFileInfo.text,
              })
              .then(() => console.log("Compartido con éxito"))
              .catch((error) => console.error("Error al compartir:", error));
          } else {
            console.error("El navegador no soporta la Web Share API.");
          }
        })
        .finally(() => {
          // Finaliza el estado de carga
          setIsLoadingImage(false);
        });
    })
    .catch((error) => {
      console.error("Error al generar la imagen:", error);
      // Finaliza el estado de carga en caso de error
      setIsLoadingImage(false);
    });
};
