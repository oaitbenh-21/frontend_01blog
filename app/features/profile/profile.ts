import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Post } from '../../components/post/post';
import { NgFor, NgIf } from '@angular/common';
import { PostService } from '../../services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PostResponseDto } from '../../dto/post-dto';
import { UserDto } from '../../dto/user-dto';
import { UserService } from '../../services/user.service';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-profile',
  imports: [Post, NgIf, NgFor, Header],
  templateUrl: './profile.html',
  standalone: true,
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  protected POSTS_URL = 'http://localhost:8080/posts';
  loading: boolean = true;
  user?: UserDto;
  posts: PostResponseDto[] = [];

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }


  fetchPosts(): void {
    const page = 0;
    const size = 10;

    this.postService.getAllPosts(page, size).subscribe(posts => {
      posts.map(post => {
        post.content = post.content.substring(0, 200);
        return post
      })
      this.posts = posts;
      this.loading = false;
      this.cdr.detectChanges();
    });
  }


  ngOnInit() {
    const userid = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getUserProfile(userid).subscribe({
      next: user => {
        this.user = user;
        this.cdr.detectChanges();
        this.fetchPosts();
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
        this.cdr.detectChanges();
      }
    });
  }

}

