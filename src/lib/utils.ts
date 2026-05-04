import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseSizesInput(input: string): number[] {
  const parseNumber = (value: string) => {
    const num = Number(value.trim());
    return Number.isFinite(num) ? Math.round(num) : null;
  };

  const sizes = new Set<number>();

  input
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .forEach((part) => {
      if (part.includes('-')) {
        const [start, end] = part.split(/[-–—]/).map((value) => parseNumber(value));
        if (start !== null && end !== null && start <= end) {
          for (let size = start; size <= end; size += 1) {
            sizes.add(size);
          }
        }
      } else {
        const single = parseNumber(part);
        if (single !== null) sizes.add(single);
      }
    });

  return Array.from(sizes).sort((a, b) => a - b);
}
