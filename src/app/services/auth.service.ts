import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface LoginRequest {
  correo: string;
  password: string;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7092/api/users/login';

  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {}

  login(user: LoginRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(this.apiUrl, user);
  }

  logout() {
    this.cookieService.delete('authToken'); 
    localStorage.removeItem('authToken'); 

    this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => this.router.navigate(['/login']), 
      error: () => this.router.navigate(['/login'])
    });
  }

  isAuthenticated(): boolean {
    return !!this.cookieService.get('authToken');
  }

  clearAuth() {
    this.cookieService.delete('authToken'); 
    localStorage.removeItem('authToken'); 
  }

}
