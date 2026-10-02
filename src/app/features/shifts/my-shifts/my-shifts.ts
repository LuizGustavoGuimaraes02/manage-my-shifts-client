import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Shift, ShiftService } from '../../../core/services/shift';

const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;

@Component({
    selector: 'app-my-shifts',
    imports: [CommonModule, Navbar, RouterLink],
    styleUrl: './my-shifts.css',
    templateUrl: './my-shifts.html'
})
export class MyShifts implements OnInit {
    shifts: Shift[] = [];
    errorMessage = '';
    isLoading = false;

    constructor(
        private shiftService: ShiftService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadMyShifts();
    }

    loadMyShifts(): void {
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

    getShiftHours(shift: Shift): number {
        const start = new Date(shift.start);
        const end = new Date(shift.end);

        return (end.getTime() - start.getTime()) / MILLISECONDS_PER_HOUR;
    }

    getShiftProfit(shift: Shift): number {
        return this.getShiftHours(shift) * shift.perHour;
    }

    get totalShifts(): number {
        return this.shifts.length;
    }

    get totalHours(): number {
        return this.shifts.reduce((total, shift) => total + this.getShiftHours(shift), 0);
    }

    get totalEarnings(): number {
        return this.shifts.reduce((total, shift) => total + this.getShiftProfit(shift), 0);
    }
}