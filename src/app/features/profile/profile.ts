import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Post } from '../../components/post/post';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { UserDto } from '../../dto/user-dto';
import { UserService } from '../../services/user.service';
import { Header } from '../../components/header/header';
import { FloatingDialog } from '../../components/dialog/dialog';
import { FloatingReport } from '../../components/report/report';
import { TimeAgoPipe } from '../../../pipes/timeAgo';
import { ReportRequestDto } from '../../dto/report-dto';
import { ReportService } from '../../services/report.service';
import { EditProfileComponent } from '../../components/edit-profile/edit-profile';

@Component({
  selector: 'app-profile',
  imports: [Post, Header, FloatingDialog, FloatingReport, TimeAgoPipe, EditProfileComponent],
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

  showEditProfile: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private reportService: ReportService
  ) { }

  onUserUpdated() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.showEditProfile = false;
    this.loadUser(id);
  }

  showReport: boolean = false;
  reportMessage: string = '';
  pendingAction: () => void = () => undefined;

  showDialog: boolean = false;
  dialogMessage: string = '';
  dialogTitle: string = '';

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadUser(id);
    this.router.events.subscribe((event) => {
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
          }
          this.cdr.detectChanges();
        },
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
          }
          this.cdr.detectChanges();
        },
      });
    }
  }

  showReportSection() {
    this.showReport = true;
  }

  handleReport(report: ReportRequestDto) {
    this.reportService.reportUser(report).subscribe({
      next: () => {
        this.showReport = false;
        this.dialogTitle = 'Report Submited';
        this.dialogMessage = 'Report submitted successfully.';
        this.showDialog = true;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.dialogTitle = 'Failed To Submit Report';
        this.dialogMessage = err.error?.message || 'Failed to submit report. Please try again.';
        this.showDialog = true;
        this.showReport = false;
        this.cdr.markForCheck();
      },
    });
  }

  loadUser(id: number) {
    this.userService.getUserProfile(id).subscribe({
      next: (user) => {
        this.user = user;
        this.user.posts.map((post) => {
          post.content =
            post.content.length > 200 ? post.content.substring(0, 200) + '...' : post.content;
          return post;
        });
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
  showEditProfileComponent() {
    this.showEditProfile = true;
    this.cdr.markForCheck();
  }
}
