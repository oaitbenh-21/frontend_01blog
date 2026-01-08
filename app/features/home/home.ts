import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { Post } from '../../components/post/post';
import { Header } from '../../components/header/header';
import { ProfileNav } from '../../components/profile-nav/profile-nav';
import { NgFor, NgIf } from '@angular/common';
import { PostResponseDto } from '../../dto/post-dto';


@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [NgFor, NgIf, Post, Header, ProfileNav],
  standalone: true
})
@Injectable({ providedIn: 'root' })
export class Home implements OnInit {
  protected POSTS_URL = 'http://localhost:8080/posts';
  loading: boolean = true;

  posts: PostResponseDto[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  fetchPosts(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.loading = false;
      return;
    }

    const page = 0;
    const size = 10;

    this.http.get<PostResponseDto[]>(this.POSTS_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
    }).pipe(
      catchError(() => {
        this.loading = false;
        this.cdr.detectChanges();
        return of([]);
      })
    ).subscribe(posts => {
      posts.map(post => {
        post.content = post.content.substring(0, 200);
        return post
      })
      this.posts = posts;
      this.loading = false;
      this.cdr.detectChanges();
      console.log('Posts received:', posts);
      console.log('Loading status:', this.loading);
    });
  }


  ngOnInit() {
    const token = localStorage.getItem('token');
    this.loading = false;
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      this.fetchPosts();
      this.loading = true;
    }
  }
}
