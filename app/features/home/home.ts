import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Post } from '../../components/post/post';
import { Header } from '../../components/header/header';
import { NgFor, NgIf } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { PostService } from '../../services/post.service';
import { PostResponseDto } from '../../dto/post-dto';


@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [NgFor, NgIf, Post, Header, Navbar],
  standalone: true
})
@Injectable({ providedIn: 'root' })
export class Home implements OnInit {
  protected POSTS_URL = 'http://localhost:8080/posts';
  loading: boolean = true;

  posts: PostResponseDto[] = [];

  constructor(
    private service: PostService,
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

    this.service.getAllPosts(page, size).subscribe(posts => {
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
