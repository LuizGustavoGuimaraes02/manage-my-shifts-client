import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
    getShiftUserId,
    getShiftWorkerName,
    Shift,
    ShiftService
} from '../../../core/services/shift';
import { calculateShiftProfit } from '../../../core/utils/shift-calculations';
import {
    getHighestEarningMonth,
    getThisWeekPastShifts,
    getWorkerOfTheMonth,
    MonthEarnings
} from '../../../core/utils/shift-statistics';

interface WorkerOfTheMonth {
    name: string;
    count: number;
}

@Component({
    selector: 'app-admin-home',
    imports: [CommonModule],
    styleUrl: './admin-home.css',
    templateUrl: './admin-home.html'
})
export class AdminHome implements OnInit {
    isLoading = false;
    errorMessage = '';
    currentMonth = new Date();

    workerOfTheMonth: WorkerOfTheMonth | null = null;
    thisWeekPastShifts: Shift[] = [];
    highestEarningMonth: MonthEarnings | null = null;

    constructor(
        private shiftService: ShiftService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadData();
    }

    getWorkerName(shift: Shift): string {
        return getShiftWorkerName(shift);
    }

    getShiftProfit(shift: Shift): number {
        return calculateShiftProfit(shift);
    }

    private loadData(): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.shiftService.getAllShifts().subscribe({
            next: (shifts) => {
                const topWorker = getWorkerOfTheMonth(shifts);
                const topWorkerShift = topWorker
                    ? shifts.find((shift) => getShiftUserId(shift) === topWorker.userId)
                    : undefined;

                this.workerOfTheMonth =
                    topWorker && topWorkerShift
                        ? { name: getShiftWorkerName(topWorkerShift), count: topWorker.count }
                        : null;
                this.thisWeekPastShifts = getThisWeekPastShifts(shifts);
                this.highestEarningMonth = getHighestEarningMonth(shifts);
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error(error);
                this.errorMessage = 'Could not load the dashboard data.';
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }
}