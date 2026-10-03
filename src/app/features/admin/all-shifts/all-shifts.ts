import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
    getShiftUserId,
    getShiftWorkerName,
    Shift,
    ShiftService
} from '../../../core/services/shift';
import { calculateShiftProfit } from '../../../core/utils/shift-calculations';
import { getUniquePlaces, matchesDateRange, matchesPlace } from '../../../core/utils/shift-filters';
import { Navbar } from '../../../shared/components/navbar/navbar';

interface WorkerOption {
    id: string;
    name: string;
}

@Component({
    selector: 'app-all-shifts',
    imports: [CommonModule, FormsModule, RouterLink, Navbar],
    styleUrl: './all-shifts.css',
    templateUrl: './all-shifts.html'
})
export class AllShifts implements OnInit {
    shifts: Shift[] = [];
    errorMessage = '';
    isLoading = false;

    selectedWorkerId = '';
    selectedPlace = '';
    fromDate = '';
    toDate = '';

    constructor(
        private shiftService: ShiftService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadAllShifts();
    }

    loadAllShifts(): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.shiftService.getAllShifts().subscribe({
            next: (shifts) => {
                this.shifts = shifts;
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error(error);
                this.errorMessage = 'Could not load the shifts.';
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    clearFilters(): void {
        this.selectedWorkerId = '';
        this.selectedPlace = '';
        this.fromDate = '';
        this.toDate = '';
    }

    getWorkerName(shift: Shift): string {
        return getShiftWorkerName(shift);
    }

    getShiftProfit(shift: Shift): number {
        return calculateShiftProfit(shift);
    }

    get workers(): WorkerOption[] {
        const namesById = new Map<string, string>();

        for (const shift of this.shifts) {
            namesById.set(getShiftUserId(shift), getShiftWorkerName(shift));
        }

        return [...namesById]
            .map(([id, name]) => ({ id, name }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }

    get places(): string[] {
        return getUniquePlaces(this.shifts);
    }

    get filteredShifts(): Shift[] {
        return this.shifts.filter(
            (shift) =>
                this.matchesWorker(shift) &&
                matchesPlace(shift, this.selectedPlace) &&
                matchesDateRange(shift, this.fromDate, this.toDate)
        );
    }

    private matchesWorker(shift: Shift): boolean {
        return !this.selectedWorkerId || getShiftUserId(shift) === this.selectedWorkerId;
    }
}