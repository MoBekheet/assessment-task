import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User, UserResponse, UsersResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl: string = 'https://reqres.in/api';
  private http = inject(HttpClient);

  login(body: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, body);
  }

  getUser(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users/${id}`);
  }

  getUsers(page: number): Observable<UsersResponse> {
    return this.http.get<UsersResponse>(`${this.apiUrl}/users`, { params: { page } });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  addUser({ first_name, job }: User): Observable<{name: string, job: string, id: number}> {
    return this.http.post<{name: string, job: string, id: number}>(`${this.apiUrl}/users`, { name: first_name, job });
  }

  updateUser({ first_name, job, id }: User): Observable<{ job: string, name: string }> {
    return this.http.put<{ job: string, name: string }>(`${this.apiUrl}/users/${id}`, { name: first_name, job });
  }
}
