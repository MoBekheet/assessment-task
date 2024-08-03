import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
export const tokenKey = btoa('authTokens');

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  public login(body: { email: string; password: string }): Observable<any> {
    return this.apiService.loginReq(body).pipe(tap(res => res.token && localStorage.setItem(tokenKey, res.token)));
  }

  public logout(): void {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  public get isLoggedIn(): boolean {
    return !!localStorage.getItem(tokenKey);
  }

  public get getToken(): string | null {
    return localStorage.getItem(tokenKey);
  }
}
