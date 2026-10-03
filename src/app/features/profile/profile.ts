import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user';
import { Navbar } from '../../shared/components/navbar/navbar';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, Navbar],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  isLoading = true;
  isSaving = false;
  isDeleting = false;
  isEditingOtherUser = false;
  errorMessage = '';
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
    const routeUserId = this.route.snapshot.paramMap.get('id');

    if (routeUserId) {
      this.userId = routeUserId;
      this.isEditingOtherUser = true;
    } else {
      const currentUser = this.authService.getCurrentUser();

      if (!currentUser?.id) {
        this.router.navigate(['/login']);
        return;
      }

      this.userId = currentUser.id;
    }

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
        this.errorMessage = 'Could not load the profile.';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = '';

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
        this.isSaving = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Could not update the profile.';
        this.isSaving = false;
        this.cdr.detectChanges();
      }
    });
  }

  get canDelete(): boolean {
    return this.isEditingOtherUser && this.userId !== this.authService.getCurrentUser()?.id;
  }

  deleteWorker(): void {
    const confirmed = window.confirm(
      'Delete this worker? Their shifts and comments will also be removed. This cannot be undone.'
    );

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.isDeleting = true;

    this.userService.deleteUser(this.userId).subscribe({
      next: () => {
        this.isDeleting = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Could not delete the worker.';
        this.isDeleting = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewWorkerShifts(): void {
    this.router.navigate(['/admin/workers', this.userId, 'shifts']);
  }

  goBack(): void {
    this.router.navigate([this.isEditingOtherUser ? '/admin/workers' : '/home']);
  }
}