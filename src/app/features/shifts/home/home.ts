import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
    selector: 'app-home',
    imports: [CommonModule, Navbar],
    styleUrl: './home.css',
    templateUrl: './home.html'
})
export class Home {
    constructor(private authService: AuthService) {}

    get currentUser() {
        return this.authService.getCurrentUser();
    }

    get isAdmin(): boolean {
        return this.currentUser?.permission === 'admin';
    }
}