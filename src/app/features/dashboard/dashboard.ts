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
import { FloatingDialog } from '../../components/dialog/dialog';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgClass, Header, NgFor, NgIf, TimeAgoPipe, FloatingComfirm, FloatingDialog],
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

  // floating confirm
  showConfirm: boolean = false;
  confirmMessage: string = '';
  pendingAction: () => void = () => undefined;

  // floating dialog
  showDialog: boolean = false;
  dialogMessage: string = '';
  dialogTitle: string = '';

  constructor(
    private admin: AdminService,
    private post: PostService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadReports();
    this.loadUsers();
    this.loadPosts();
    this.admin.getAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
        this.cdr.markForCheck();
      },
      error: (err) => this.showErrorDialog('Failed to load analytics', err),
    });
  }


  togleVisible(getted_post: PostResponseDto) {
    this.confirmMessage = `Do you confirm to ${getted_post.visible ? 'Unvisible' : 'Visible'} post ` + getted_post.id + ' ?';
    this.showConfirm = true;
    this.pendingAction = () => {
      this.admin.toggleVisiblePost(getted_post.id).subscribe({
        next: () => {
          this.loadPosts();
          getted_post.visible = !getted_post.visible;
        },
        error: (err) => {
          this.showErrorDialog('Failed to invisible post', err)
        },
      })
    };
  }

  private showErrorDialog(title: string, err: any) {
    console.log(err);

    this.dialogTitle = title;
    this.dialogMessage = err?.error?.message || 'An unexpected error occurred';
    this.showDialog = true;
    this.cdr.markForCheck();
  }

  private loadReports(): void {
    this.admin.getAllReports().subscribe({
      next: (data) => {
        this.reports = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.showErrorDialog('Failed to load reports', err),
    });
  }

  private loadUsers(): void {
    this.admin.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.showErrorDialog('Failed to load users', err),
    });
  }

  private loadPosts(): void {
    this.admin.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.cdr.detectChanges();
      },
      error: (err) => this.showErrorDialog('Failed to load posts', err),
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

  onClosed() {
    this.showConfirm = false;
  }

  onClosedDialog() {
    this.showDialog = false;
  }

  banUser(id: number) {
    this.confirmMessage = 'Do you confirm to ban user ' + id + ' ?';
    this.showConfirm = true;
    this.pendingAction = () => {
      this.admin.banUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => this.showErrorDialog(`Failed to ban user ${id}`, err),
      });
    };
    this.cdr.detectChanges();
  }

  deleteUser(id: number) {
    this.confirmMessage = 'Do you confirm to delete user ' + id + ' ?';
    this.showConfirm = true;
    this.pendingAction = () => {
      this.admin.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: (err) => this.showErrorDialog(`Failed to delete user ${id}`, err),
      });
    };
    this.cdr.detectChanges();
  }

  deletePost(id: number) {
    this.confirmMessage = 'Do you confirm to delete post ' + id + ' ?';
    this.showConfirm = true;
    this.pendingAction = () => {
      this.admin.deletePost(id).subscribe({
        next: () => this.loadPosts(),
        error: (err) => this.showErrorDialog(`Failed to delete post ${id}`, err),
      });
    };
    this.cdr.detectChanges();
  }

  resolveReport(id: number) {
    this.confirmMessage = 'Do you confirm to resolve report ' + id + ' ?';
    this.showConfirm = true;
    this.pendingAction = () => {
      this.admin.resolveReport(id).subscribe({
        next: () => this.loadReports(),
        error: (err) => this.showErrorDialog(`Failed to resolve report ${id}`, err),
      });
    };
    this.cdr.detectChanges();
  }

  deleteReport(id: number) {
    this.confirmMessage = 'Do you confirm to delete report ' + id + ' ?';
    this.showConfirm = true;
    this.pendingAction = () => {
      this.admin.deleteReport(id).subscribe({
        next: () => this.loadReports(),
        error: (err) => this.showErrorDialog(`Failed to delete report ${id}`, err),
      });
    };
    this.cdr.detectChanges();
  }
}
