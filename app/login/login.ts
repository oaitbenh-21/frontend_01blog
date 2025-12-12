import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

interface LoginData {
  username: string
  password: string
}


@Component({
  selector: 'app-login',
  imports: [Field],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})

export class Login {
  loginModel = signal<LoginData>({
    username: '',
    password: '',
  })
  error = ''
  response: Observable<any> = new Observable();
  readonly Login_url: string = "http://localhost:8080/api/v1/auth/authenticate"
  loginForm = form(this.loginModel)
  constructor(private http: HttpClient, private router: Router) {
  }

  login() {
    this.http.post(this.Login_url, {
      username: this.loginForm.username().value(),
      password: this.loginForm.password().value()
    }).subscribe({
      next: (data: any) => {
        if (data?.token) {
          localStorage.setItem("token", data.token);
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.error = "Invalid credentials";
        console.error(err);
      }
    });
  }
}
