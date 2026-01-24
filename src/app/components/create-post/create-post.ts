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

  filesBase64: string[] = [];

  saving = false;
  error = '';

  @Input() visible = false;
  @Input() content = '';
  @Input() description = '';

  @Output() closed = new EventEmitter<void>();

  dialogMessage = '';
  dialogTitle = '';
  showDialogMessage = false;

  private editor!: any;
  private readonly POSTS_URL = 'http://localhost:8080/posts';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.editor = new MediumEditor(this.editorRef.nativeElement, {
      placeholder: { text: 'Write your post here...' },
      toolbar: {
        buttons: ['bold', 'italic', 'underline', 'anchor', 'h2', 'h3', 'quote'],
      },
    });

    this.editor.subscribe('editableInput', () => {
      this.content = this.editorRef.nativeElement.innerHTML || '';
    });
  }

  onContentChange(editor: HTMLElement) {
    this.content = editor.innerHTML || '';
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    if (!files?.length) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.filesBase64.push(reader.result as string);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    });
  }

  removeFile(index: number): void {
    this.filesBase64.splice(index, 1);
  }

  createPost(): void {
    if (this.saving || !this.content.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      this.error = 'You must be logged in to create a post.';
      return;
    }

    this.saving = true;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http
      .post<PostResponseDto>(
        this.POSTS_URL,
        {
          content: this.content,
          description: this.description,
          files: this.filesBase64,
        },
        { headers }
      )
      .subscribe({
        next: (post) => {
          this.router.navigate(['/posts', post.id]);
        },
        error: () => {
          this.dialogTitle = 'Failed';
          this.dialogMessage = 'Failed to create post.';
          this.showDialogMessage = true;
          this.saving = false;
        },
      });
  }

  close() {
    this.visible = false;
    this.closed.emit();
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  onClosedDialog() {
    this.showDialogMessage = false;
  }
}
