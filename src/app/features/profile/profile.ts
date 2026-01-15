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
  user?: UserDto = {
    id: 0,
    username: '',
    avatar: '',
    email: '',
    role: '',
    bio: '',
    deleted: false,
    posts: []
  };

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const userid = Number(this.route.snapshot.paramMap.get('id'));

    this.userService.getUserProfile(userid).subscribe({
      next: user => {
        this.user = user;
        this.user.posts.map(post => {
          post.content = post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content;
          return post;
        }) || []
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.log(err);
        this.cdr.detectChanges();
      }
    });
  }

}

