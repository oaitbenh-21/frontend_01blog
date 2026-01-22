import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule, NgFor, NgForOf } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { PostResponseDto } from '../../dto/post-dto';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';
import { TimeAgoPipe } from '../../../pipes/timeAgo';
import { AdminService } from '../../services/admin.service';
import { ReportService } from '../../services/report.service';
import { ReportRequestDto } from '../../dto/report-dto';

@Component({
  selector: 'app-post',
  templateUrl: './post.html',
  styleUrls: ['./post.scss'],
  standalone: true,
  imports: [CommonModule, MarkdownModule, TimeAgoPipe, NgForOf],
  providers: [MarkdownModule.forRoot().providers!],
})
export class Post {
  @Input() post: PostResponseDto = {
    id: 1,
    content: '',
    CDate: '',
    author: { id: 1, username: 'Unknown', avatar: '', role: '' },
    likes: 0,
    description: '',
    likedByCurrentUser: false,
    comments: [],
    fileUrl: [],
    isDeleted: false,
  };
  @Input() desc: boolean = false;

  constructor(
    private router: Router,
    private service: PostService,
    private cdr: ChangeDetectorRef,
    private report: ReportService
  ) {}

  goToUser() {
    this.router.navigate(['/profile', this.post.author.id]);
  }
  goToPost() {
    this.router.navigate(['/posts', this.post.id || 2]);
  }

  likePost() {
    this.post.likedByCurrentUser = !this.post.likedByCurrentUser;
    this.service.likePost(this.post.id).subscribe({
      next: () => {
        if (this.post.likedByCurrentUser) {
          this.post.likes++;
          this.post.likedByCurrentUser = true;
        } else {
          this.post.likes--;
          this.post.likedByCurrentUser = false;
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        if (error.status == 200) {
          if (this.post.likedByCurrentUser) {
            this.post.likes++;
            this.post.likedByCurrentUser = true;
          } else {
            this.post.likes--;
            this.post.likedByCurrentUser = false;
          }
        }
        this.cdr.detectChanges();
      },
    });
    this.cdr.detectChanges();
  }

  submitReport(reason: string) {
    let report: ReportRequestDto = {
      postid: this.post.id,
      userid: 0,
      reason: reason,
    };
    this.report.submitReport(report);
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
