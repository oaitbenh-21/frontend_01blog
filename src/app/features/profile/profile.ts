import { ChangeDetectorRef, Component, NgModule, OnInit } from '@angular/core';
import { Post } from '../../components/post/post';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { UserDto } from '../../dto/user-dto';
import { UserService } from '../../services/user.service';
import { Header } from '../../components/header/header';

@Component({
  selector: 'app-profile',
  imports: [Post, NgIf, NgFor, Header, DatePipe],
  templateUrl: './profile.html',
  standalone: true,
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  protected POSTS_URL = 'http://localhost:8080/posts';
  loading: boolean = true;
  user: UserDto = {
    id: 0,
    username: '',
    avatar: '',
    mine: false,
    follow: false,
    email: '',
    role: '',
    bio: '',
    deleted: false,
    followersCount: 0,
    followingCount: 0,
    posts: [],
    CDate: '',
    banned: false,
  };
  postsError: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUser(id);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.loadUser(id);
      }
    });
  }
  toggleFollow() {
    if (this.user.follow) {
      this.userService.unsubscribeFromUser(this.user.id).subscribe({
        next: () => {
          this.user!.follow = false;
          this.user.followersCount--;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 200) {
            this.user!.follow = false;
            this.user.followersCount--;
          } else {
            console.log('Error following user:', err);
          }
          this.cdr.detectChanges();
        }
      });
    } else {
      this.userService.subscribeToUser(this.user.id).subscribe({
        next: () => {
          this.user!.follow = true;
          this.user.followersCount++;
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.loading = false;
          if (err.status === 200) {
            this.user!.follow = true;
            this.user.followersCount++;
          } else {
            console.log('Error following user:', err);
          }
          this.cdr.detectChanges();
        }
      });
    }
  }

  loadUser(id: number) {
    this.userService.getUserProfile(id).subscribe({
      next: user => {
        this.user = user;
        this.user.posts.map(post => {
          post.content = post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content;
          return post;
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error getting user:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  navigateToEditProfile() {
    this.router.navigate(['/profile/edit', this.user.id]);
  }
}

