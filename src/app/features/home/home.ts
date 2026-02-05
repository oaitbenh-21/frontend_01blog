import { ChangeDetectorRef, Component, Injectable, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Post } from '../../components/post/post';
import { Header } from '../../components/header/header';
import { PostService } from '../../services/post.service';
import { PostResponseDto } from '../../dto/post-dto';
import { UserService } from '../../services/user.service';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  imports: [Post, Header, RouterModule, NgClass],
  standalone: true
})
export class Home implements OnInit {
  protected POSTS_URL = 'http://localhost:8080/posts';
  loading: boolean = true;

  posts: PostResponseDto[] = [];
  activeFilter: 'all' | 'subs' = 'all';


  constructor(
    private service: PostService,
    private router: Router,
    public userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  fetchPosts(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.loading = false;
      return;
    }
    let request = this.activeFilter == 'all' ? this.service.getAllPosts() : this.service.getSubscribedPosts();
    request.subscribe(posts => {
      this.posts = posts;
      this.loading = false;
      this.cdr.detectChanges();
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
      this.userService.getCurrentUser().subscribe(user => {
        this.userService.setUser(user);
        this.cdr.detectChanges();
      });
    }
  }

  onPostDeleted(id: number) {
    this.posts = this.posts.filter(p => p.id !== id);
    this.cdr.detectChanges();
  }
}
