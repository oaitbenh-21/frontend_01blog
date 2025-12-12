import { Component, Injectable, signal, WritableSignal } from '@angular/core';
import { Post } from '../components/post/post';
import { Header } from '../components/header/header';
import { ProfileNav } from '../components/profile-nav/profile-nav';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [Post, Header, ProfileNav],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
@Injectable({ providedIn: 'root' })
export class Home {
  private response: Observable<any> = new Observable();
  protected PING_URL: string = "http://localhost:8080/api/v1/user/ping"
  constructor(private http: HttpClient, private router: Router) { }
  PingWithToken(): Observable<boolean> {
    return this.http.get(this.PING_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).pipe(
      map((value: any) => value.status == "success"),
      catchError(() => of(false))
    );
  }


  ngOnInit() {
    this.PingWithToken().subscribe(auth => {
      if (!auth) {
        this.router.navigate(['/login']);
      }
    });
  }

}
