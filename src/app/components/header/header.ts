import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation
import { jwtDecode } from 'jwt-decode';
import { AuthorDto } from '../../dto/user-dto';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-header',
  imports: [NgIf],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  user: AuthorDto = { id: 0, username: '', avatar: '', role: '' };

  constructor(private router: Router, private userService: UserService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {

    this.userService.getCurrentUser().subscribe({
      next: (data: AuthorDto) => {
        this.user = data;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
      }
    });

  }

  navigateToHome() {
    this.router.navigate(['/']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile', 1]);

  }

  navigateToAdminDashboard() {
    this.router.navigate(['/admin/dashboard']);
  }

  logout() {
    this.router.navigate(['/logout']);
  }
}