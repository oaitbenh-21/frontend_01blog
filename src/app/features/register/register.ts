import { Component, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../../dto/auth-dto';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [Field],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  readonly Login_url: string = "http://localhost:8080/auth/login"
  response: Observable<any> = new Observable();
  error: string = '';
  registerForm = form(signal<RegisterRequest>({
    username: '',
    email: '',
    password: '',
  }))

  constructor(private router: Router, private service: AuthService) { }

  register() {
    this.service.register({
      username: this.registerForm().value().username,
      email: this.registerForm().value().email,
      password: this.registerForm().value().password
    }).subscribe({
      next: (data: any) => {
        if (data?.accessToken) {
          console.log(data);

          localStorage.setItem("token", data.accessToken);
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        console.log(err);

        this.error = err.message;
        console.error(err);
      }
    });
  }

}
