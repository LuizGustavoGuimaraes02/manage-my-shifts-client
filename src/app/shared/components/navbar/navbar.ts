import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user';

@Component({
    selector: 'app-navbar',
    imports: [CommonModule, RouterLink],
    styleUrl: './navbar.css',
    templateUrl: './navbar.html'
})
export class Navbar implements OnInit {
    firstName = '';

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    get currentUser() {
        return this.authService.getCurrentUser();
    }

    get isAdmin(): boolean {
        return this.currentUser?.permission === 'admin';
    }

    ngOnInit(): void {
        const userId = this.currentUser?.id;

        if (!userId) {
            return;
        }

        this.userService.getUserById(userId).subscribe({
            next: (user) => {
                this.firstName = user.firstName;
                this.cdr.detectChanges();
            },
            error: () => {
                this.firstName = '';
                this.cdr.detectChanges();
            }
        });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}