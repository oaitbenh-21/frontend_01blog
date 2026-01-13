import { Component, ElementRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, of, finalize } from 'rxjs';
import MediumEditor from 'medium-editor';
import { Header } from '../../components/header/header';

interface PostResponseDto {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    avatar: string;
    role: string;
  };
  likes: number;
  likedByCurrentUser: boolean;
  comments: any[];
}

@Component({
  selector: 'app-create-post',
  standalone: true,
  templateUrl: './create-post.html',
  styleUrls: ['./create-post.scss'],
  imports: [
    CommonModule,
    Header
  ],
})
export class CreatePostComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;

  content = '';
  saving = false;
  private editor!: any;

  private readonly POSTS_URL = 'http://localhost:8080/posts';

  constructor(private http: HttpClient, private router: Router) { }

  onContentChange(editor: HTMLElement) {
    this.content = editor.innerText || '';
  }

  ngAfterViewInit(): void {
    this.editor = new MediumEditor(this.editorRef.nativeElement, {
      placeholder: { text: 'Write your post here...' },
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote']
      },
      autoLink: true
    });

    this.editor.subscribe('editableInput', () => {
      this.content = this.editorRef.nativeElement.innerHTML;
    });
  }

  ngOnDestroy(): void {
    if (this.editor) {
      this.editor.destroy();
    }
  }

  createPost(): void {
    if (this.saving || !this.content.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found.');
      return;
    }

    this.saving = true;

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http
      .post<PostResponseDto>(this.POSTS_URL, { content: this.content }, { headers })
      .subscribe({
        next: (newPost: any) => {
          console.log(newPost);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
}
