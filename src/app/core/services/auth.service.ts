import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface RegisterPayload {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface LoginPayload {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/user`;

    constructor(private http: HttpClient) {}

    register(data: RegisterPayload): Observable<any> {
        return this.http.post(`${this.apiUrl}/`, data);
    }

    login(data: LoginPayload): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
    }
}