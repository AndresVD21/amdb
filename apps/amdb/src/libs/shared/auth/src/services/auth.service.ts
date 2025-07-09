import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private accessToken: string | null = this.loadToken();
  private API = 'http://localhost:3000/api';

  private http = inject(HttpClient);

  login(email: string, password: string) {
    return this.http.post<{ accessToken: string, name: string }>(`${this.API}/auth/login`, { email, password }, {
      withCredentials: true
    });
  }

  register(firstName: string, lastName: string, email: string, password: string) {
    return this.http.post(`${this.API}/auth/register`, { firstName, lastName, email, password });
  }

  refreshToken() {
    return this.http.post<{ accessToken: string }>(`${this.API}/auth/refresh`, {}, {
      withCredentials: true
    });
  }

  logout() {
    this.accessToken = null;
    localStorage.removeItem(this.TOKEN_KEY);
    return this.http.post(`${this.API}/auth/logout`, {}, { withCredentials: true });
  }

  saveToken(token: string) {
    this.accessToken = token;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    const token = this.accessToken;
    return token;
  }

  getName(): string | null {
    const name = localStorage.getItem('name');
    return name;
  }

  private loadToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
