import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { Shift, ShiftService } from '../../../core/services/shift';
import { calculateShiftHours, calculateShiftProfit } from '../../../core/utils/shift-calculations';
import { getUniquePlaces, matchesDateRange, matchesPlace } from '../../../core/utils/shift-filters';

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

    getShiftProfit(shift: Shift): number {
        return calculateShiftProfit(shift);
    }

    get places(): string[] {
        return getUniquePlaces(this.shifts);
    }

    get filteredShifts(): Shift[] {
        return this.shifts.filter(
            (shift) =>
                matchesPlace(shift, this.selectedPlace) &&
                matchesDateRange(shift, this.fromDate, this.toDate)
        );
    }

    get totalShifts(): number {
        return this.filteredShifts.length;
    }

    get totalHours(): number {
        return this.filteredShifts.reduce((total, shift) => total + calculateShiftHours(shift), 0);
    }

    get totalEarnings(): number {
        return this.filteredShifts.reduce((total, shift) => total + calculateShiftProfit(shift), 0);
    }
}