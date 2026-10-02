import { Shift } from '../services/shift';

const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;

export function calculateShiftHours(shift: Shift): number {
    const start = new Date(shift.start);
    const end = new Date(shift.end);

    return (end.getTime() - start.getTime()) / MILLISECONDS_PER_HOUR;
}

export function calculateShiftProfit(shift: Shift): number {
    return calculateShiftHours(shift) * shift.perHour;
}