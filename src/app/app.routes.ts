import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { AllShifts } from './features/admin/all-shifts/all-shifts';
import { AllWorkers } from './features/admin/all-workers/all-workers';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Profile } from './features/profile/profile';
import { Home } from './features/shifts/home/home';
import { MyShifts } from './features/shifts/my-shifts/my-shifts';
import { ShiftForm } from './features/shifts/shift-form/shift-form';
import { WorkerShifts } from './features/admin/worker-shifts/worker-shifts';

export const routes: Routes = [
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'home', component: Home, canActivate: [authGuard] },
    { path: 'my-shifts', component: MyShifts, canActivate: [authGuard] },
    { path: 'shifts/new', component: ShiftForm, canActivate: [authGuard] },
    { path: 'shifts/:id/edit', component: ShiftForm, canActivate: [authGuard] },
    { path: 'profile', component: Profile, canActivate: [authGuard] },
    { path: 'admin/shifts', component: AllShifts, canActivate: [authGuard] },
    { path: 'admin/workers', component: AllWorkers, canActivate: [authGuard] },
    { path: 'admin/workers/:id', component: Profile, canActivate: [authGuard] },
    { path: 'admin/workers/:id/shifts', component: WorkerShifts, canActivate: [authGuard] },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];