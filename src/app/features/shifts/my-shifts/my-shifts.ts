import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Shift, ShiftService } from '../../../core/services/shift';

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

    get totalShifts(): number {
        return this.shifts.length;
    }

    get totalHours(): number {
        return this.shifts.reduce((total, shift) => {
            const start = new Date(shift.start);
            const end = new Date(shift.end);
            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

            return total + hours;
        }, 0);
    }

    get totalEarnings(): number {
        return this.shifts.reduce((total, shift) => {
            const start = new Date(shift.start);
            const end = new Date(shift.end);
            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

            return total + hours * shift.perHour;
        }, 0);
    }
}