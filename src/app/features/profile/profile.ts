import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  isLoading = true;
  isSaving = false;
  errorMessage = '';
  successMessage = '';
  userId = '';

  profileForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    birthDate: ['', [Validators.required]],
    password: ['', [Validators.minLength(6)]],
    confirmPassword: ['']
  });

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();

    if (!currentUser?.id) {
      this.router.navigate(['/login']);
      return;
    }

    this.userId = currentUser.id;
    this.loadUser();
  }

  loadUser(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          birthDate: user.birthDate ? user.birthDate.substring(0, 10) : ''
        });

        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Could not load your profile.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, birthDate, password, confirmPassword } = this.profileForm.value;

    if (password && password !== confirmPassword) {
      this.errorMessage = 'Password confirmation does not match.';
      return;
    }

    const payload = {
      firstName: firstName ?? '',
      lastName: lastName ?? '',
      email: email ?? '',
      birthDate: birthDate ?? '',
      ...(password ? { password } : {})
    };

    this.isSaving = true;

    this.userService.updateUser(this.userId, payload).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully.';
        this.isSaving = false;
        this.profileForm.patchValue({
          password: '',
          confirmPassword: ''
        });
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Could not update your profile.';
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}