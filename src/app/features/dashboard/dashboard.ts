import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ReportsTab } from '../../components/reports-tab/reports-tab';
import { PostsTab } from '../../components/posts-tab/posts-tab';

import { UserDto } from '../../dto/user-dto';
import { PostResponseDto } from '../../dto/post-dto';

import { PostService } from '../../services/post.service';
import { AdminService } from '../../services/admin.service';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReportsTab, PostsTab, NgClass],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  reports: ReportDto[] = [];
  users: UserDto[] = [];
  posts: PostResponseDto[] = [];
  analytics: AnalyticsDto = {
    totalPosts: 0,
    totalUsers: 0,
    totalReports: 0,
  };

  constructor(
    private admin: AdminService,
    private post: PostService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadReports();
    this.loadUsers();
    this.loadPosts();
    this.admin.getAnalytics().subscribe({
      next: (data) => {
        this.analytics = data
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to load analytics', err),
    });
    this.cdr.markForCheck();
  }

  private loadReports(): void {
    this.admin.getAllReports().subscribe({
      next: (data) => {
        this.reports = data
      },
      error: (err) => console.error('Failed to load reports', err),
    });
  }

  private loadUsers(): void {
    this.admin.getAllUsers().subscribe({
      next: (data) => {
        this.users = data
      },
      error: (err) => console.error('Failed to load users', err),
    });
  }

  private loadPosts(): void {
    this.post.getAllPosts(0, 100).subscribe({
      next: (data) => (this.posts = data),
      error: (err) => console.error('Failed to load posts', err),
    });
  }
  goToUser(id: number) {
    this.router.navigate([`/profile/${id}`]);
  }
}
