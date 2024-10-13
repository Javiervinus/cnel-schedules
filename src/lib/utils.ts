import { clsx, type ClassValue } from "clsx";
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
export function formatDate(value: Date): string {
  const date = new Date(value);

  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}
export function capitalizeFirstLetter(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
