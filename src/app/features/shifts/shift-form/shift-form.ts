import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
    Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { ShiftPayload, ShiftService } from '../../../core/services/shift';
import { AuthService } from '../../../core/services/auth.service';

function endAfterStartValidator(group: AbstractControl): ValidationErrors | null {
    const startTime = group.get('startTime')?.value;
    const endTime = group.get('endTime')?.value;

    if (!startTime || !endTime) {
        return null;
    }

    return endTime > startTime ? null : { endBeforeStart: true };
}

function pad(value: number): string {
    return String(value).padStart(2, '0');
}

function validDateValidator(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;

    if (!value) {
        return null;
    }

    const year = Number(value.slice(0, 4));

    return value.length === 10 && year >= 2000 ? null : { invalidDate: true };
}

@Component({
    selector: 'app-shift-form',
    imports: [ReactiveFormsModule, RouterLink, Navbar],
    styleUrl: './shift-form.css',
    templateUrl: './shift-form.html'
})
export class ShiftForm implements OnInit {
    private readonly formBuilder = inject(FormBuilder);
    private readonly shiftService = inject(ShiftService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly cdr = inject(ChangeDetectorRef);
    private readonly authService = inject(AuthService);

    readonly form = this.formBuilder.nonNullable.group(
        {
            name: ['', [Validators.required, Validators.pattern(/\S/)]],
            date: ['', [Validators.required, validDateValidator]],
            startTime: ['', [Validators.required]],
            endTime: ['', [Validators.required]],
            perHour: [0, [Validators.required, Validators.min(0)]],
            place: ['', [Validators.required, Validators.pattern(/\S/)]],
            comments: ['']
        },
        { validators: endAfterStartValidator }
    );

    places: string[] = [];
    shiftId: string | null = null;
    isLoading = false;
    isSaving = false;
    errorMessage = '';

    get isEditMode(): boolean {
        return this.shiftId !== null;
    }

        get isAdmin(): boolean {
        return this.authService.getCurrentUser()?.permission === 'admin';
    }

    get backRoute(): string {
        return this.isAdmin ? '/admin/shifts' : '/my-shifts';
    }

    ngOnInit(): void {
        this.shiftId = this.route.snapshot.paramMap.get('id');
        this.loadPlaceSuggestions();

        if (this.shiftId) {
            this.loadShift(this.shiftId);
        }
    }

    isInvalid(controlName: string): boolean {
        const control = this.form.get(controlName);

        return !!control && control.invalid && control.touched;
    }

        onSubmit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }


        const payload = this.buildPayload();
        const request$ = this.shiftId
            ? this.shiftService.updateShift(this.shiftId, payload)
            : this.shiftService.createShift(payload);

        this.isSaving = true;
        this.errorMessage = '';

        request$.subscribe({
            next: () => {
                this.router.navigate([this.backRoute]);
            },
            error: (error: HttpErrorResponse) => {
                this.errorMessage = error.error?.message ?? 'Could not save the shift.';
                this.isSaving = false;
                this.cdr.detectChanges();
            }
        });
    }

    private loadPlaceSuggestions(): void {
        const shifts$ = this.isAdmin
            ? this.shiftService.getAllShifts()
            : this.shiftService.getMyShifts();

        shifts$.subscribe({
            next: (shifts) => {
                this.places = [...new Set(shifts.map((shift) => shift.place))].sort();
                this.cdr.detectChanges();
            },
            error: (error) => console.error(error)
        });
    }

    private loadShift(id: string): void {
        this.isLoading = true;

        this.shiftService.getShiftById(id).subscribe({
            next: (shift) => {
                this.form.patchValue({
                    name: shift.name,
                    date: this.toDateInput(shift.start),
                    startTime: this.toTimeInput(shift.start),
                    endTime: this.toTimeInput(shift.end),
                    perHour: shift.perHour,
                    place: shift.place,
                    comments: shift.comments
                });
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error(error);
                this.errorMessage = 'Could not load this shift.';
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    private buildPayload(): ShiftPayload {
        const { name, date, startTime, endTime, perHour, place, comments } = this.form.getRawValue();

        return {
            name: name.trim(),
            start: new Date(`${date}T${startTime}`).toISOString(),
            end: new Date(`${date}T${endTime}`).toISOString(),
            perHour,
            place: place.trim(),
            comments: comments.trim()
        };
    }

    private toDateInput(isoDate: string): string {
        const date = new Date(isoDate);
        const year = String(date.getFullYear()).padStart(4, '0');

        return `${year}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }

    private toTimeInput(isoDate: string): string {
        const date = new Date(isoDate);

        return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    }
}