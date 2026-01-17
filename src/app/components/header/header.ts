import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-header',
  imports: [NgIf],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  avatar = "https://github.com/mdo.png";
  username = jwtDecode.toString();
  role = "admin";

  constructor(private router: Router) { }

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