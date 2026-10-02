import { Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
    selector: 'app-profile',
    imports: [Navbar],
    styleUrl: './profile.css',
    templateUrl: './profile.html'
})
export class Profile {}