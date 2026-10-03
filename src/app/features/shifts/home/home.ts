import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Shift, ShiftService } from '../../../core/services/shift';
import { calculateShiftProfit } from '../../../core/utils/shift-calculations';
import {
    getHighestEarningMonth,
    getThisWeekPastShifts,
    MonthEarnings
} from '../../../core/utils/shift-statistics';
import { Navbar } from '../../../shared/components/navbar/navbar';

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
        return getThisWeekPastShifts(this.shifts);
    }

    get highestEarningMonth(): MonthEarnings | null {
        return getHighestEarningMonth(this.shifts);
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
}