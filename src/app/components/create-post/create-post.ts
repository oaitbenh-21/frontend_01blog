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
  OnChanges,
  SimpleChanges,
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
export class CreatePostComponent
  implements AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('editor') editorRef!: ElementRef<HTMLDivElement>;

  /** MODE */
  @Input() edit = false;
  @Input() postId?: number;

  /** EXISTING POST DATA (EDIT MODE) */
  @Input() content = '';
  @Input() description = '';
  @Input() existingFiles: string[] = []; // base64 or URLs

  /** UI */
  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  /** FILES */
  filesBase64: string[] = [];
  removedFiles: number[] = []; // optional if backend supports removal

  saving = false;

  dialogTitle = '';
  dialogMessage = '';
  showDialogMessage = false;

  private editor!: any;
  private readonly POSTS_URL = 'http://localhost:8080/posts';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible && this.edit) {
      // preload existing images
      this.filesBase64 = [...this.existingFiles];
      setTimeout(() => {
        if (this.editorRef) {
          this.editorRef.nativeElement.innerHTML = this.content || '';
        }
      });
    }
  }

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

  submit(): void {
    if (this.saving || !this.content.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    this.saving = true;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const payload = {
      content: this.content,
      description: this.description,
      file: this.filesBase64,
    };

    const request$ = this.edit && this.postId
      ? this.http.put<PostResponseDto>(
        `${this.POSTS_URL}/${this.postId}`,
        payload,
        { headers }
      )
      : this.http.post<PostResponseDto>(
        this.POSTS_URL,
        payload,
        { headers }
      );

    request$.subscribe({
      next: () => {
        this.saving = false;
        this.saved.emit();
        this.close();
      },
      error: (err) => {
        this.dialogTitle = err.error.error || 'Failed to submit';
        this.dialogMessage = err.error?.errors?.description || `Failed to ${this.edit ? 'save' : 'create'} post`;
        this.showDialogMessage = true;
        this.saving = false;
        this.close();
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
