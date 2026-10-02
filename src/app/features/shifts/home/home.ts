import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Shift, ShiftService } from '../../../core/services/shift';
import { calculateShiftProfit } from '../../../core/utils/shift-calculations';
import { Navbar } from '../../../shared/components/navbar/navbar';

interface MonthEarnings {
    month: Date;
    total: number;
}

@Component({
    selector: 'app-home',
    imports: [CommonModule, Navbar],
    styleUrl: './home.css',
    templateUrl: './home.html'
})
export class Home implements OnInit {
    shifts: Shift[] = [];
    isLoading = false;
    errorMessage = '';

    constructor(
        private authService: AuthService,
        private shiftService: ShiftService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        if (!this.isAdmin) {
            this.loadMyShifts();
        }
    }

    get currentUser() {
        return this.authService.getCurrentUser();
    }

    get isAdmin(): boolean {
        return this.currentUser?.permission === 'admin';
    }

    get upcomingShift(): Shift | null {
        const now = new Date();

        const upcoming = this.shifts
            .filter((shift) => new Date(shift.start) > now)
            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());

        return upcoming[0] ?? null;
    }

    get thisWeekPastShifts(): Shift[] {
        const now = new Date();
        const weekStart = this.getStartOfWeek(now);

        return this.shifts
            .filter((shift) => new Date(shift.start) >= weekStart && new Date(shift.end) <= now)
            .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
    }

    get highestEarningMonth(): MonthEarnings | null {
        const now = new Date();
        const totalsByMonth = new Map<string, MonthEarnings>();

        for (const shift of this.shifts) {
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

    getShiftProfit(shift: Shift): number {
        return calculateShiftProfit(shift);
    }

    private loadMyShifts(): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.shiftService.getMyShifts().subscribe({
            next: (shifts) => {
                this.shifts = shifts;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error(error);
                this.errorMessage = 'Could not load your shifts.';
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    private getStartOfWeek(date: Date): Date {
        const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const daysSinceMonday = (start.getDay() + 6) % 7;

        start.setDate(start.getDate() - daysSinceMonday);

        return start;
    }
}