import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cookieService: CookieService
  ) {}

  ngOnInit() {
    this.authService.clearAuth(); 
  }

  login() {
    const user = { correo: this.correo, password: this.password };

    this.authService.login(user).subscribe({
      next: (response) => {
        if (response.data) {
          const token = response.data.replace('Bearer ', ''); 
          this.cookieService.set('authToken', token, { path: '/', secure: true, sameSite: 'Strict' });

          this.router.navigate(['/users']); 
        }
      },
      error: () => {
        this.errorMessage = 'Correo o contraseña incorrectos.';
      }
    });
  }
}
