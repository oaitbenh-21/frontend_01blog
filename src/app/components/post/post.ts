import { ChangeDetectorRef, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { PostResponseDto } from '../../dto/post-dto';
import { CreatePostComponent } from '../create-post/create-post';
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
  imports: [CommonModule, MarkdownModule, TimeAgoPipe, NgForOf, FloatingReport, FloatingDialog, CreatePostComponent],
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
  @Output() deleted = new EventEmitter<number>();

  // edit modal state
  showEditModal = false;
  editContent = '';
  editDescription = '';
  editFiles: string[] = [];

  constructor(
    private router: Router,
    private service: PostService,
    private cdr: ChangeDetectorRef,
    private reportService: ReportService
  ) { }

  VIDEO_EXTENSIONS = [
    'mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'm4v', '3gp', 'ts'
  ];

  IMAGE_EXTENSIONS = [
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'bmp', 'svg', 'ico', 'tiff'
  ];

  getExtension(url: string): string | null {
    const cleanUrl = url.split(/[?#]/)[0];
    const match = cleanUrl.match(/\.([a-z0-9]+)$/i);
    return match ? match[1].toLowerCase() : null;
  }

  isVideo(url: string): boolean {
    const ext = this.getExtension(url);
    return !!ext && this.VIDEO_EXTENSIONS.includes(ext);
  }

  isImage(url: string): boolean {
    const ext = this.getExtension(url);
    return !!ext && this.IMAGE_EXTENSIONS.includes(ext);
  }


  goToUser() {
    this.router.navigate(['/profile', this.post.author.id]);
  }

  editPost() {
    if (!this.post.mine) return;
    this.editContent = this.post.content || '';
    this.editDescription = this.post.description || '';
    this.editFiles = [...(this.post.fileUrl || [])];
    this.showEditModal = true;
  }

  onSavedEdit() {
    this.service.getPostById(this.post.id).subscribe({
      next: (p) => {
        this.post = p;
        this.showEditModal = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.showEditModal = false;
        this.cdr.detectChanges();
      }
    });
  }

  deletePost() {
    if (!this.post.mine) return;
    this.service.deletePost(this.post.id).subscribe({
      next: () => {
        this.dialogTitle = 'Deleted';
        this.dialogMessage = 'Post deleted successfully.';
        this.showDialogMessage = true;
        this.deleted.emit(this.post.id);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.dialogTitle = 'Failed To Delete';
        this.dialogMessage = err?.error?.message || 'Failed to delete post. Please try again.';
        this.showDialogMessage = true;
        this.cdr.detectChanges();
      }
    });
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
    console.log(this.post.author.avatar);
    return this.post.author.avatar ? 'http://localhost:8080/' + this.post.author.avatar : 'https://bootdey.com/img/Content/avatar/avatar5.png';
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
