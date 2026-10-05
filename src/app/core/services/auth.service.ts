import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface RegisterPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

interface ResetPasswordPayload {
    email: string;
    password: string;
}

interface CurrentUser {
    id: string;
    permission: 'admin' | 'regular_user';
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/user`;
    private tokenKey = 'token';

    constructor(private http: HttpClient) {}

    register(data: RegisterPayload): Observable<any> {
        return this.http.post(`${this.apiUrl}/`, data);
    }

    login(data: LoginPayload): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
    }

    resetPassword(data: ResetPasswordPayload): Observable<{ message: string }> {
        return this.http.post<{ message: string }>(`${this.apiUrl}/reset-password`, data);
    }

    saveToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    getCurrentUser(): CurrentUser | null {
        const token = this.getToken();

        if (!token) {
            return null;
        }

        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));

        return {
            id: decodedPayload.id,
            permission: decodedPayload.permission
        };
    }

        isLoggedIn(): boolean {
        const token = this.getToken();

        if (token === null) {
            return false;
        }

        if (this.isTokenExpired(token)) {
            this.logout();
            return false;
        }

        return true;
    }

    private isTokenExpired(token: string): boolean {
        try {
            const base64Payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(atob(base64Payload));

            return typeof payload.exp === 'number' && payload.exp * 1000 <= Date.now();
        } catch {
            return true;
        }
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
    }
}