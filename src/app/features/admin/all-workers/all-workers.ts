import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { User, UserService } from '../../../core/services/user';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
    selector: 'app-all-workers',
    imports: [CommonModule, RouterLink, Navbar],
    styleUrl: './all-workers.css',
    templateUrl: './all-workers.html'
})
export class AllWorkers implements OnInit {
    workers: User[] = [];
    errorMessage = '';
    isLoading = false;

    constructor(
        private userService: UserService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loadWorkers();
    }

    loadWorkers(): void {
        this.isLoading = true;
        this.errorMessage = '';

        this.userService.getAllUsers().subscribe({
            next: (users) => {
                this.workers = [...users].sort((a, b) =>
                    `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
                );
                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (error) => {
                console.error(error);
                this.errorMessage = 'Could not load the workers.';
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }
}