import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-navbar',
    imports: [CommonModule, RouterLink],
    styleUrl: './navbar.css',
    templateUrl: './navbar.html'
})
export class Navbar {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    get currentUser() {
        return this.authService.getCurrentUser();
    }

    get isAdmin(): boolean {
        return this.currentUser?.permission === 'admin';
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}