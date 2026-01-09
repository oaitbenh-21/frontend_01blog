import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { MarkdownModule } from 'ngx-markdown';
import { Header } from '../../components/header/header';

interface PostResponseDto {
  content: string;
  author: { id: number; username: string; avatar: string; role: string };
  likes: number;
  likedByCurrentUser: boolean;
  comments: any[];
}

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.html',
  styleUrls: ['./create-post.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownModule, Header],
  providers: [MarkdownModule.forRoot().providers!]
})
export class CreatePostComponent {
  content = '';
  saving = false;
  protected POSTS_URL = 'http://localhost:8080/posts';

  constructor(private http: HttpClient, private router: Router) { }

  createPost() {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.saving = true;

    this.http
      .post<PostResponseDto>(
        this.POSTS_URL,
        { content: this.content },
        { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
      )
      .pipe(catchError(() => of(undefined)))
      .subscribe((newPost) => {
        this.saving = false;
        if (newPost) {
          this.router.navigate(['/posts', newPost.author.id]); // navigate to the new post page
        }
      });
  }
}
