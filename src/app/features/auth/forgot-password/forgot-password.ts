import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-forgot-password',
    imports: [CommonModule, FormsModule, RouterLink],
    styleUrls: ['../login/login.css', './forgot-password.css'],
    templateUrl: './forgot-password.html'
})
export class ForgotPassword {
    email = '';
    password = '';
    confirmPassword = '';
    errors: string[] = [];
    isSaving = false;
    isDone = false;

    constructor(
        private authService: AuthService,
        private cdr: ChangeDetectorRef
    ) {}

    private validate(): string[] {
        const foundErrors: string[] = [];

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/;
        if (!emailPattern.test(this.email)) {
            foundErrors.push('Email must be in the format name@domain.com.');
        }

        if (this.password.length < 6) {
            foundErrors.push('Password must be at least 6 characters long.');
        }

        if (this.password !== this.confirmPassword) {
            foundErrors.push('Passwords do not match.');
        }

        return foundErrors;
    }

    onSubmit(): void {
        this.errors = this.validate();

        if (this.errors.length > 0) {
            return;
        }

        const confirmed = window.confirm(
            'Resetting the password will permanently delete ALL data of this account, including its shifts. This cannot be undone. Do you want to continue?'
        );

        if (!confirmed) {
            return;
        }

        this.isSaving = true;

        this.authService.resetPassword({ email: this.email, password: this.password }).subscribe({
            next: () => {
                this.isSaving = false;
                this.isDone = true;
                this.cdr.detectChanges();
            },
            error: (err: any) => {
                this.errors = [err.error?.message || 'Could not reset the password. Please try again.'];
                this.isSaving = false;
                this.cdr.detectChanges();
            }
        });
    }
}