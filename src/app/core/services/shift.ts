import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface Shift {
    _id: string;
    userId: string;
    name: string;
    start: string;
    end: string;
    perHour: number;
    place: string;
    comments: string;
}

export interface ShiftPayload {
    name: string;
    start: string;
    end: string;
    perHour: number;
    place: string;
    comments?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ShiftService {
    private apiUrl = `${environment.apiUrl}/shifts`;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {}

    private getAuthHeaders(): HttpHeaders {
        const token = this.authService.getToken();

        return new HttpHeaders({
            Authorization: `Bearer ${token}`
        });
    }

    getAllShifts(): Observable<Shift[]> {
        return this.http.get<Shift[]>(`${this.apiUrl}/`, {
            headers: this.getAuthHeaders()
        });
    }

    getMyShifts(): Observable<Shift[]> {
        return this.http.get<Shift[]>(`${this.apiUrl}/my`, {
            headers: this.getAuthHeaders()
        });
    }

    getShiftById(id: string): Observable<Shift> {
        return this.http.get<Shift>(`${this.apiUrl}/${id}`, {
            headers: this.getAuthHeaders()
        });
    }

    createShift(data: ShiftPayload): Observable<Shift> {
        return this.http.post<Shift>(`${this.apiUrl}/`, data, {
            headers: this.getAuthHeaders()
        });
    }

    updateShift(id: string, data: Partial<ShiftPayload>): Observable<Shift> {
        return this.http.patch<Shift>(`${this.apiUrl}/${id}`, data, {
            headers: this.getAuthHeaders()
        });
    }

    deleteShift(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, {
            headers: this.getAuthHeaders()
        });
    }
}