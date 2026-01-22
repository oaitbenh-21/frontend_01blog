import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import MediumEditor from 'medium-editor';
import { Header } from '../../components/header/header';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, Header, FormsModule],
})
export class CreatePostComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;

  file: File | null = null;
  FileBase64: string = '';
  content = '';
  description = '';
  saving = false;
  error: string = '';

  private editor!: any;
  private readonly POSTS_URL = 'http://localhost:8080/posts';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.editor = new MediumEditor(this.editorRef.nativeElement, {
      placeholder: { text: 'Write your post here...' },
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
      },
      autoLink: true,
    });

    this.editor.subscribe('editableInput', () => {
      this.content = this.editorRef.nativeElement.innerHTML;
    });
  }

  onContentChange(editor: HTMLElement) {
    this.content = editor.innerText || '';
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (!file) return;

    this.file = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.FileBase64 = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
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
      .post<PostResponseDto>(
        this.POSTS_URL,
        {
          content: this.content,
          description: this.description,
          file: this.FileBase64,
        },
        { headers }
      )
      .subscribe({
        next: (newPost) => {
          console.log(newPost);
          this.router.navigate(['/posts', newPost.id]);
        },
        error: (err) => {
          this.error =
            err.error?.errors?.file ||
            err.error?.errors?.message ||
            'An error occurred while creating post';
          setTimeout(() => {
            this.error = '';
            this.cdr.detectChanges();
          }, 30000);
          this.saving = false;
          this.cdr.detectChanges();
        },
      });
  }

  ngOnDestroy(): void {
    if (this.editor) this.editor.destroy();
  }
}
