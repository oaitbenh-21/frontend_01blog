import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { PostResponseDto } from '../../dto/post-dto';
import { Router } from '@angular/router';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.html',
  styleUrls: ['./post.scss'],
  standalone: true,
  imports: [CommonModule, MarkdownModule],
  providers: [
    MarkdownModule.forRoot().providers!
  ]

})
export class Post {
  @Input() post: PostResponseDto = {
    id: 0,
    content: '',
    createdAt: "",
    author: { id: 0, username: 'Unknown', avatar: '', role: '' },
    likes: 0,
    likedByCurrentUser: false,
    comments: [],
  };

  constructor(private router: Router, private service: PostService, private cdr: ChangeDetectorRef
  ) { }

  goToUser() {
    this.router.navigate(['/profile', this.post?.author?.avatar || "1"]);
  }

  likePost() {
    this.post.likedByCurrentUser = !this.post.likedByCurrentUser;
    this.service.likePost(this.post.id).subscribe();
    if (this.post.likedByCurrentUser) {
      this.post.likes++;
    } else {
      this.post.likes--;
    }
    this.cdr.detectChanges();
  }

  get avatar() { return this.post.author.avatar || 'https://github.com/mdo.png'; }
  get username() { return this.post.author.username; }
  get liked() { return this.post.likedByCurrentUser; }
  get likesCount() { return this.post.likes; }
  get comments() { return this.post.comments; }
  get date() { return this.post.createdAt; }

}
