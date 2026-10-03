import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { getShiftUserId, Shift, ShiftService } from '../../../core/services/shift';
import { UserService } from '../../../core/services/user';
import { calculateShiftProfit } from '../../../core/utils/shift-calculations';
import { getUniquePlaces, matchesDateRange, matchesPlace } from '../../../core/utils/shift-filters';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
    selector: 'app-worker-shifts',
    imports: [CommonModule, FormsModule, RouterLink, Navbar],
    styleUrl: './worker-shifts.css',
    templateUrl: './worker-shifts.html'
})
export class WorkerShifts implements OnInit {
    workerId = '';
    workerName = '';
    shifts: Shift[] = [];
    errorMessage = '';
    isLoading = false;

    selectedPlace = '';
    fromDate = '';
    toDate = '';

    constructor(
        private route: ActivatedRoute,
        private shiftService: ShiftService,
        private userService: UserService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.workerId = this.route.snapshot.paramMap.get('id') ?? '';
        this.loadData();
    }

    loadData(): void {
        this.isLoading = true;
        this.errorMessage = '';

        forkJoin({
            user: this.userService.getUserById(this.workerId),
            shifts: this.shiftService.getAllShifts()
        }).subscribe({
            next: ({ user, shifts }) => {
                this.workerName = `${user.firstName} ${user.lastName}`;
                this.shifts = shifts.filter((shift) => getShiftUserId(shift) === this.workerId);
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error(error);
                this.errorMessage = 'Could not load the worker shifts.';
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
}