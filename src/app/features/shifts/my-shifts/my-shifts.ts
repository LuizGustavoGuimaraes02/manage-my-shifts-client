import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Shift, ShiftService } from '../../../core/services/shift';

const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;

@Component({
    selector: 'app-my-shifts',
    imports: [CommonModule, FormsModule, Navbar, RouterLink],
    styleUrl: './my-shifts.css',
    templateUrl: './my-shifts.html'
})
export class MyShifts implements OnInit {
    shifts: Shift[] = [];
    errorMessage = '';
    isLoading = false;

    selectedPlace = '';
    fromDate = '';
    toDate = '';

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

    clearFilters(): void {
        this.selectedPlace = '';
        this.fromDate = '';
        this.toDate = '';
    }

    getShiftHours(shift: Shift): number {
        const start = new Date(shift.start);
        const end = new Date(shift.end);

        return (end.getTime() - start.getTime()) / MILLISECONDS_PER_HOUR;
    }

    getShiftProfit(shift: Shift): number {
        return this.getShiftHours(shift) * shift.perHour;
    }

    get places(): string[] {
        return [...new Set(this.shifts.map((shift) => shift.place))].sort();
    }

    get filteredShifts(): Shift[] {
        return this.shifts.filter(
            (shift) => this.matchesPlace(shift) && this.matchesDateRange(shift)
        );
    }

    get totalShifts(): number {
        return this.filteredShifts.length;
    }

    get totalHours(): number {
        return this.filteredShifts.reduce((total, shift) => total + this.getShiftHours(shift), 0);
    }

    get totalEarnings(): number {
        return this.filteredShifts.reduce((total, shift) => total + this.getShiftProfit(shift), 0);
    }

    private matchesPlace(shift: Shift): boolean {
        return !this.selectedPlace || shift.place === this.selectedPlace;
    }

    private matchesDateRange(shift: Shift): boolean {
        const shiftStart = new Date(shift.start);

        if (this.fromDate && shiftStart < new Date(`${this.fromDate}T00:00:00`)) {
            return false;
        }

        if (this.toDate && shiftStart > new Date(`${this.toDate}T23:59:59.999`)) {
            return false;
        }

        return true;
    }
}