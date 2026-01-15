import { Component, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginRequest } from '../../dto/auth-dto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [Field],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login {
  readonly Login_url: string = "http://localhost:8080/auth/login"
  response: Observable<any> = new Observable();
  error: string = '';

  loginForm = form(signal<LoginRequest>({
    email: '',
    password: '',
  }))

  constructor(private router: Router, private service: AuthService) { }
  login() {
    this.service.login(this.loginForm().value()).subscribe({
      next: (data: any) => {
        if (data?.accessToken) {
          console.log(data);

          localStorage.setItem("token", data.accessToken);
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.log(err);

        this.error = "Invalid credentials";
        console.error(err);
      }
    });
  }
}
