import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.html',
    styleUrl: './login.css'
})
export class Login {
    email = '';
    password = '';
    errorMessage = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    onSubmit(): void {
        this.errorMessage = '';

        this.authService.login({ email: this.email, password: this.password }).subscribe({
            next: (response) => {
                this.authService.saveToken(response.token);
                this.router.navigate(['/home']);
            },
            error: (err: any) => {
                this.errorMessage = err.error?.message || 'Login failed. Please try again.';
                this.cdr.detectChanges();
            }
        });
    }
}