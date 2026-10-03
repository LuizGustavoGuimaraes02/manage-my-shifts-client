import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './register.html',
    styleUrl: './register.css'
})
export class Register {
    email = '';
    password = '';
    confirmPassword = '';
    firstName = '';
    lastName = '';
    birthDate = '';

    errors: string[] = [];

    constructor(
        private authService: AuthService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    private calculateAge(birthDate: string): number {
        const today = new Date();
        const dateOfBirth = new Date(birthDate);
        let age = today.getFullYear() - dateOfBirth.getFullYear();
        const monthDifference = today.getMonth() - dateOfBirth.getMonth();

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < dateOfBirth.getDate())
        ) {
            age--;
        }

        return age;
    }

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

        if (this.firstName.trim().length < 2) {
            foundErrors.push('First name must contain at least 2 characters.');
        }

        if (this.lastName.trim().length < 2) {
            foundErrors.push('Last name must contain at least 2 characters.');
        }

        if (!this.birthDate) {
            foundErrors.push('Birth date is required.');
        } else {
            const age = this.calculateAge(this.birthDate);

            if (Number.isNaN(age) || age < 6 || age > 130) {
                foundErrors.push('Age must be between 6 and 130 years old.');
            }
        }

        return foundErrors;
    }

    onSubmit(): void {
        this.errors = this.validate();

        if (this.errors.length > 0) {
            return;
        }

        this.authService.register({
            email: this.email,
            password: this.password,
            firstName: this.firstName,
            lastName: this.lastName,
            birthDate: this.birthDate
        }).subscribe({
            next: () => {
                this.router.navigate(['/home']);
            },
            error: (err: any) => {
                this.errors = [err.error?.message || 'Registration failed. Please try again.'];
                this.cdr.detectChanges();
            }
        });
    }
}