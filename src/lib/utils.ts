import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs)
}

/**
 * Formats seconds into 'h min sg' with strict rules:
 * - If hours are 0, omit them (format: 'm min s sg').
 * - If both minutes and hours are 0, omit both (format: 's sg').
 * - If hours > 0 but minutes are 0, show '0 min' (e.g., '1 h 0 min 45 sg').
 */
export function formatDuration(totalSeconds: number): string {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.round(totalSeconds % 60);

    let parts: string[] = [];

    if (h > 0) {
        parts.push(`${h} h`);
        parts.push(`${m} min`);
    } else if (m > 0) {
        parts.push(`${m} min`);
    }

    parts.push(`${s} sg`);

    return parts.join(' ');
}

/**
 * Perform linear interpolation between two points (x0, y0) and (x1, y1)
 */
export function linearInterpolate(x0: number, y0: number, x1: number, y1: number, x: number): number {
    if (Math.abs(x1 - x0) < 1e-10) {
        throw new Error("Division by zero in interpolation: x0 and x1 are too close.");
    }
    return y0 + (x - x0) * ((y1 - y0) / (x1 - x0));
}
