import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { UserDto } from '../../dto/user-dto';
import { PostResponseDto } from '../../dto/post-dto';

import { PostService } from '../../services/post.service';
import { AdminService } from '../../services/admin.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Header } from "../../components/header/header";
import { TimeAgoPipe } from '../../../pipes/timeAgo';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgClass, Header, NgFor, NgIf, TimeAgoPipe],
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
        console.log(data);
        this.analytics = data
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load analytics', err)
        console.log(err);
      },
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
  desc(post: PostResponseDto) {
    if (post.description.length > 15) {
      post.description = post.description.substring(0, 15);
    }
    return post.description + "...";
  }

  banUser(id: number) {
    this.admin.banUser(id).subscribe({
      next(value) {
      },
      error(err) {
      },
    })

  }
  deleteUser(id: number) {
    this.admin.deleteUser(id).subscribe({
      next(value) {
      },
      error(err) {
      },
    })

  }
  deletePost(id: number) {
    this.admin.deletePost(id).subscribe({
      next(value) {

      },
      error(err) {

      },
    })
  }
  resolveReport(id: number) {
    this.admin.resolveReport(id).subscribe({
      next(value) {

      },
      error(err) {

      },
    })
  }
  deleteReport(id: number) {
    this.admin.deleteReport(id).subscribe({
      next(value) {

      },
      error(err) {

      },
    })
  }
}
