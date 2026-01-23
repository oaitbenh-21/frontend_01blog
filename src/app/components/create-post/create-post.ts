import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnDestroy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import MediumEditor from 'medium-editor';
import { FormsModule } from '@angular/forms';
import { FloatingDialog } from '../dialog/dialog';

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
  imports: [CommonModule, FormsModule, NgStyle, FloatingDialog],
})
export class CreatePostComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;

  file: File | null = null;
  FileBase64: string = '';
  saving = false;
  error: string = '';

  @Input() edit: boolean = false;
  @Input() content: string = '';
  @Input() description: string = '';
  @Input() files: string[] = [];
  @Input() post_id: number = 0;
  @Input() visible: boolean = false;

  @Output() closed = new EventEmitter<void>();
  @Output() show_error = new EventEmitter<void>();

  dialogMessage: string = '';
  dialogTitle: string = '';
  showDialogMessage: boolean = false;

  private editor!: any;
  private readonly POSTS_URL = 'http://localhost:8080/posts';

  constructor(private http: HttpClient, private router: Router, private cdr: ChangeDetectorRef) { }

  ngAfterViewInit(): void {
    this.editor = new MediumEditor(this.editorRef.nativeElement, {
      placeholder: { text: 'Write your post here...' },
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
      },
      autoLink: true,
    });

    this.editor.subscribe('editableInput', () => {
      this.content = this.editorRef.nativeElement.innerHTML || '';
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
    if (this.saving || !this.content?.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found.');
      this.error = 'You must be logged in to create a post.';
      return;
    }

    this.saving = true;
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post<PostResponseDto>(
      this.POSTS_URL,
      {
        content: this.content,
        description: this.description,
        file: this.FileBase64,
      },
      { headers }
    ).subscribe({
      next: (newPost) => {
        this.router.navigate(['/posts', newPost.id]);
      },
      error: (err) => {
        this.dialogTitle = err.error?.error || 'failed to create post';
        this.dialogMessage = err.error?.errors?.description || 'Failed to create post. Please try again.';
        this.showDialogMessage = true;
        this.saving = false;
        this.visible = false;
        this.cdr.detectChanges();
      },
    });
  }

  close() {
    this.visible = false;
    this.closed.emit();
  }

  ngOnDestroy(): void {
    if (this.editor) this.editor.destroy();
  }

  onClosedDialog() {
    this.dialogMessage = '';
    this.dialogTitle = '';
    this.showDialogMessage = false;
  }
}
