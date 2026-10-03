import { Shift } from '../services/shift';

export function getUniquePlaces(shifts: Shift[]): string[] {
    return [...new Set(shifts.map((shift) => shift.place))].sort();
}

export function matchesPlace(shift: Shift, place: string): boolean {
    return !place || shift.place === place;
}

export function matchesDateRange(shift: Shift, fromDate: string, toDate: string): boolean {
    const shiftStart = new Date(shift.start);

    if (fromDate && shiftStart < new Date(`${fromDate}T00:00:00`)) {
        return false;
    }

    if (toDate && shiftStart > new Date(`${toDate}T23:59:59.999`)) {
        return false;
    }

    return true;
}