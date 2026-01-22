import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UserDto } from '../../dto/user-dto';
import { PostResponseDto } from '../../dto/post-dto';
import { ReportDto } from '../../dto/report-dto';
import { PostService } from '../../services/post.service';
import { AdminService } from '../../services/admin.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { Header } from '../../components/header/header';
import { TimeAgoPipe } from '../../../pipes/timeAgo';
import { FloatingComfirm } from '../../components/confirm/confirm';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgClass, Header, NgFor, NgIf, TimeAgoPipe, FloatingComfirm],
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

  showConfirm: boolean = false;
  confirmMessage: string = '';
  pendingAction: () => void = () => undefined;

  constructor(
    private admin: AdminService,
    private post: PostService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReports();
    this.loadUsers();
    this.loadPosts();
    this.admin.getAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to load analytics', err),
    });
  }

  private loadReports(): void {
    this.admin.getAllReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load reports', err),
    });
  }

  private loadUsers(): void {
    this.admin.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load users', err),
    });
  }

  private loadPosts(): void {
    this.post.getAllPosts(0, 100).subscribe({
      next: (data) => {
        this.posts = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load posts', err),
    });
  }

  goToUser(id: number) {
    this.router.navigate([`/profile/${id}`]);
  }

  desc(post: PostResponseDto) {
    return post.description.length > 15
      ? post.description.substring(0, 15) + '...'
      : post.description;
  }

  onConfirm() {
    if (this.pendingAction) {
      this.pendingAction();
      this.pendingAction = () => undefined;
    }
    this.showConfirm = false;
  }

  banUser(id: number) {
    this.confirmMessage = 'Do you confirm to ban user ' + id + ' ?';
    this.showConfirm = true;
    this.pendingAction = () => {
      this.admin.banUser(id).subscribe({
        next: () => {
          console.log('User banned');
          this.loadUsers();
        },
        error: (err) => console.error(err),
      });
    };
    this.cdr.detectChanges();
  }

  deleteUser(id: number) {
    this.confirmMessage = 'Do you confirm to delete user ' + id + ' ?';
    this.showConfirm = true;
    this.pendingAction = () => {
      this.admin.deleteUser(id).subscribe({
        next: () => {
          console.log('User deleted');
          this.loadUsers();
        },
        error: (err) => console.error(err),
      });
    };
    this.cdr.detectChanges();
  }

  deletePost(id: number) {
    this.confirmMessage = 'Do you confirm to delete post ' + id + ' ?';
    this.showConfirm = true;
    this.pendingAction = () => {
      this.admin.deletePost(id).subscribe({
        next: () => {
          console.log('Post deleted');
          this.loadPosts();
        },
        error: (err) => console.error(err),
      });
    };
    this.cdr.detectChanges();
  }

  resolveReport(id: number) {
    this.confirmMessage = 'Do you confirm to resolve report ' + id + ' ?';
    this.showConfirm = true;
    this.pendingAction = () => {
      this.admin.resolveReport(id).subscribe({
        next: () => {
          console.log('Report resolved');
          this.loadReports();
        },
        error: (err) => console.error(err),
      });
    };
    this.cdr.detectChanges();
  }

  deleteReport(id: number) {
    this.confirmMessage = 'Do you confirm to delete report ' + id + ' ?';
    this.showConfirm = true;
    this.pendingAction = () => {
      this.admin.deleteReport(id).subscribe({
        next: () => {
          console.log('Report deleted');
          this.loadReports();
        },
        error: (err) => console.error(err),
      });
    };
    this.cdr.detectChanges();
  }

  onClosed() {
    this.showConfirm = false;
  }
}
