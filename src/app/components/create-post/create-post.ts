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
import MediumEditor from 'medium-editor';
import { FormsModule } from '@angular/forms';
import { FloatingDialog } from '../dialog/dialog';

import { PostResponseDto, PostRequestDto } from '../../dto/post-dto';
import { PostService } from '../../services/post.service';

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
  // raw File objects selected by user
  files: File[] = [];
  // preview data URLs for UI
  filesBase64: string[] = [];
  removedFiles: number[] = []; // optional if backend supports removal

  saving = false;

  dialogTitle = '';
  dialogMessage = '';
  showDialogMessage = false;

  private editor!: any;
  constructor(
    private postService: PostService,
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
      this.files.push(file);
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
    this.files.splice(index, 1);
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  async submit(): Promise<void> {
    if (this.saving || !this.content.trim()) return;

    this.saving = true;

    try {
      const base64Files: string[] = [];

      // validate and convert selected files to base64 (images only)
      for (const f of this.files) {
        if (!f.type || !f.type.startsWith('image/')) {
          this.dialogTitle = 'Invalid file';
          this.dialogMessage = 'Only image files are allowed.';
          this.showDialogMessage = true;
          this.saving = false;
          return;
        }
        const dataUrl = await this.readFileAsDataUrl(f);
        const parts = dataUrl.split(',');
        base64Files.push(parts.length > 1 ? parts[1] : parts[0]);
      }

      // include existing base64 entries if any (strip data: prefix if present)
      for (const e of this.existingFiles || []) {
        if (e && e.startsWith('data:')) {
          const parts = e.split(',');
          base64Files.push(parts.length > 1 ? parts[1] : parts[0]);
        }
      }

      const payload: PostRequestDto = {
        content: this.content,
        description: this.description,
        files: base64Files,
      };

      // include removedFiles as additional field if supported by backend
      const requestBody: any = { ...payload };
      if (this.removedFiles?.length) requestBody.removedFiles = this.removedFiles;

      const request$ = this.edit && this.postId
        ? this.postService.updatePost(this.postId, requestBody)
        : this.postService.createPost(requestBody);

      request$.subscribe({
        next: () => {
          this.saving = false;
          this.saved.emit();
          this.close();
        },
        error: (err: any) => {
          this.dialogTitle = err?.error?.error || 'Failed to submit';
          this.dialogMessage = err?.error?.errors?.description || `Failed to ${this.edit ? 'save' : 'create'} post`;
          this.showDialogMessage = true;
          this.saving = false;
          this.close();
        },
      });
    } catch (err: any) {
      this.dialogTitle = 'File error';
      this.dialogMessage = 'Failed to read selected files.';
      this.showDialogMessage = true;
      this.saving = false;
    }
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
