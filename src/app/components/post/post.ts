import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { PostResponseDto } from '../../dto/post-dto';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { TimeAgoPipe } from '../../../pipes/timeAgo';
import { ReportService } from '../../services/report.service';
import { ReportRequestDto } from '../../dto/report-dto';
import { FloatingReport } from '../report/report';
import { FloatingDialog } from '../dialog/dialog';

@Component({
  selector: 'app-post',
  templateUrl: './post.html',
  styleUrls: ['./post.scss'],
  standalone: true,
  imports: [CommonModule, MarkdownModule, TimeAgoPipe, NgForOf, FloatingReport, FloatingDialog],
  providers: [MarkdownModule.forRoot().providers!],
})
export class Post {
  @Input() post: PostResponseDto = {
    id: 1,
    content: '',
    CDate: '',
    author: { id: 0, username: 'Unknown', avatar: '', role: '' },
    likes: 0,
    description: '',
    likedByCurrentUser: false,
    comments: [],
    fileUrl: [],
    visible: false,
  };
  @Input() desc: boolean = false;

  showReportModal: boolean = false;
  dialogMessage: string = '';
  dialogTitle: string = '';
  showDialogMessage: boolean = false;

  constructor(
    private router: Router,
    private service: PostService,
    private cdr: ChangeDetectorRef,
    private reportService: ReportService
  ) {}

  goToUser() {
    this.router.navigate(['/profile', this.post.author.id]);
  }

  goToPost() {
    this.router.navigate(['/posts', this.post.id]);
  }

  likePost() {
    this.post.likedByCurrentUser = !this.post.likedByCurrentUser;

    this.service.likePost(this.post.id).subscribe({
      next: () => this.updateLikes(true),
      error: () => this.updateLikes(false),
    });

    this.cdr.detectChanges();
  }

  private updateLikes(success: boolean) {
    if (success) {
      this.post.likes += this.post.likedByCurrentUser ? 1 : -1;
    } else {
      this.post.likedByCurrentUser = !this.post.likedByCurrentUser;
    }
    this.cdr.detectChanges();
  }

  openReportModal() {
    this.showReportModal = true;
    this.dialogMessage = '';
    this.showDialogMessage = false;
  }

  onClosedDialog() {
    this.showReportModal = false;
    this.dialogMessage = '';
    this.dialogTitle = '';
    this.showDialogMessage = false;
  }

  handleReport(report: ReportRequestDto) {
    this.reportService.reportPost(report).subscribe({
      next: () => {
        this.showReportModal = false;
        this.dialogTitle = 'Report Submited';
        this.dialogMessage = 'Report submitted successfully.';
        this.showDialogMessage = true;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.dialogTitle = 'Failed To Submit Report';
        this.dialogMessage = err.error?.message || 'Failed to submit report. Please try again.';
        this.showDialogMessage = true;
        this.showReportModal = false;
        this.cdr.markForCheck();
      },
    });
  }

  get avatar() {
    return this.post.author.avatar || 'https://github.com/mdo.png';
  }
  get username() {
    return this.post.author.username;
  }
  get liked() {
    return this.post.likedByCurrentUser;
  }
  get likesCount() {
    return this.post.likes;
  }
  get comments() {
    return this.post.comments;
  }
  get date() {
    return this.post.CDate;
  }
}
