import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
import { CookieService } from '../cookie/cookie.service';
import { User, AuthData, AuthCredentials } from '../../models/user.model';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY = 'user';

  private apiService = inject(ApiService);
  private cookieService = inject(CookieService);
  private router = inject(Router);

  private currentUserSignal = signal<User | null>(this.readInitialUser());
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => !!this.currentUserSignal() && !!this.getToken());

  private readInitialUser(): User | null {
    try {
      const raw = this.cookieService.get(this.USER_KEY);
      if (!raw) return null;
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }

  getToken(): string | null {
    return this.cookieService.get(this.TOKEN_KEY);
  }

  getUser(): User | null {
    return this.currentUserSignal();
  }

  saveAuth(authData: AuthData): void {
    if (authData?.token) {
      this.cookieService.set(this.TOKEN_KEY, authData.token);
    }
    if (authData?.user) {
      this.cookieService.set(this.USER_KEY, JSON.stringify(authData.user));
      this.currentUserSignal.set(authData.user);
    }
  }

  login(credentials: AuthCredentials): Observable<ApiResponse<AuthData>> {
    return this.apiService.post<ApiResponse<AuthData>>('/auth/login', credentials);
  }

  register(credentials: AuthCredentials): Observable<ApiResponse<AuthData>> {
    return this.apiService.post<ApiResponse<AuthData>>('/auth/register', credentials);
  }

  logout(): void {
    this.cookieService.delete(this.TOKEN_KEY);
    this.cookieService.delete(this.USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }
}

