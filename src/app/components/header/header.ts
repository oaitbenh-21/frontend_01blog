import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorDto } from '../../dto/user-dto';
import { UserService } from '../../services/user.service';
import { CreatePostComponent } from '../create-post/create-post';

@Component({
  selector: 'app-header',
  imports: [NgIf, CreatePostComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  standalone: true,
})
export class Header {
  user: AuthorDto = { id: 0, username: '', avatar: '', role: '' };

  postContent = '';
  postDescription = '';
  postFiles: string[] = [];
  postId = 0;
  showCreatePost = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe({
      next: (data: AuthorDto) => {
        this.user = data;
        this.cdr.detectChanges();
      },
      error: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }

  openCreatePost() {
    this.showCreatePost = true;
    this.cdr.detectChanges();
  }

  closeCreatePost() {
    this.showCreatePost = false;
  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile', this.user.id]);
  }

  navigateToAdminDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  logout() {
    this.router.navigate(['/logout']);
  }
}
