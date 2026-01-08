import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownModule } from 'ngx-markdown';
import { PostResponseDto } from '../../dto/post-dto';

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
    content: 'a',
    createdAt: "",
    author: { id: 0, username: 'Unknown', avatar: '', role: '' },
    likes: 0,
    likedByCurrentUser: false,
    comments: [],
  };

  followed = Math.random() < 0.5;

  get avatar() { return this.post.author.avatar || 'https://github.com/mdo.png'; }
  get username() { return this.post.author.username; }
  get liked() { return this.post.likedByCurrentUser; }
  get likesCount() { return this.post.likes; }
  get comments() { return this.post.comments; }
  get date() { return this.post.createdAt; }

}
