import { getShiftUserId, Shift } from '../services/shift';
import { calculateShiftProfit } from './shift-calculations';

export interface MonthEarnings {
    month: Date;
    total: number;
}

export interface WorkerShiftCount {
    userId: string;
    count: number;
}

export function getStartOfWeek(date: Date): Date {
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const daysSinceMonday = (start.getDay() + 6) % 7;

    start.setDate(start.getDate() - daysSinceMonday);

    return start;
}

export function getThisWeekPastShifts(shifts: Shift[], now: Date = new Date()): Shift[] {
    const weekStart = getStartOfWeek(now);

    return shifts
        .filter((shift) => new Date(shift.start) >= weekStart && new Date(shift.end) <= now)
        .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
}

export function getHighestEarningMonth(shifts: Shift[], now: Date = new Date()): MonthEarnings | null {
    const totalsByMonth = new Map<string, MonthEarnings>();

    for (const shift of shifts) {
        if (new Date(shift.end) > now) {
            continue;
        }

        const start = new Date(shift.start);
        const key = `${start.getFullYear()}-${start.getMonth()}`;
        const entry = totalsByMonth.get(key) ?? {
            month: new Date(start.getFullYear(), start.getMonth(), 1),
            total: 0
        };

        entry.total += calculateShiftProfit(shift);
        totalsByMonth.set(key, entry);
    }

    let best: MonthEarnings | null = null;

    for (const entry of totalsByMonth.values()) {
        if (best === null || entry.total > best.total) {
            best = entry;
        }
    }

    return best;
}

export function getWorkerOfTheMonth(shifts: Shift[], now: Date = new Date()): WorkerShiftCount | null {
    const countsByUser = new Map<string, number>();

    for (const shift of shifts) {
        const start = new Date(shift.start);

        if (start.getFullYear() !== now.getFullYear() || start.getMonth() !== now.getMonth()) {
            continue;
        }

        const userId = getShiftUserId(shift);

        countsByUser.set(userId, (countsByUser.get(userId) ?? 0) + 1);
    }

    let best: WorkerShiftCount | null = null;

    for (const [userId, count] of countsByUser) {
        if (best === null || count > best.count) {
            best = { userId, count };
        }
    }

    return best;
}