import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Home } from './features/shifts/home/home';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'home', component: Home },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];