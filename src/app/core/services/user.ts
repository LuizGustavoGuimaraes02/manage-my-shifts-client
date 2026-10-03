import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: string;
  permission: 'admin' | 'worker';
}

export interface UserUpdatePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = `${environment.apiUrl}/user`;

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  updateUser(id: string, data: UserUpdatePayload): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

    deleteUser(id: string): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}