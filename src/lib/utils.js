import { clsx } from "clsx";
<<<<<<< HEAD
import { twMerge } from "tailwind-merge";
=======
import { twMerge } from "tailwind-merge"
>>>>>>> master

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
