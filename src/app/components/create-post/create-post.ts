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
import { PostRequestDto } from '../../dto/post-dto';
import { PostService } from '../../services/post.service';
import { MediaService } from '../../services/media-service';

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

  @Input() edit = false;
  @Input() postId?: number;

  @Input() content = '';
  @Input() description = '';
  @Input() existingFiles: string[] = [];

  @Input() visible = false;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  files: File[] = [];
  filesBase64: string[] = [];

  saving = false;

  dialogTitle = '';
  dialogMessage = '';
  showDialogMessage = false;

  private editor!: any;

  constructor(
    private postService: PostService,
    private mediaService: MediaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']?.currentValue && this.edit) {
      this.filesBase64 = [...this.existingFiles];
      setTimeout(() => {
        this.editorRef.nativeElement.innerHTML = this.content || '';
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    for (const file of Array.from(input.files)) {
      this.files.push(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.filesBase64.push(reader.result as string);
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  removeFile(index: number): void {
    this.files.splice(index, 1);
    this.filesBase64.splice(index, 1);
  }

  async submit(): Promise<void> {
    if (this.saving || !this.content.trim()) return;

    this.saving = true;

    try {


      const files = await this.mediaService.normalizeMedia(
        this.files,
        this.filesBase64
      );

      const payload: PostRequestDto = {
        content: this.content,
        description: this.description,
        files,
      };
      console.log("___________________________________________________________");
      console.log(this.files);
      console.log(this.filesBase64);


      const request$ = this.edit && this.postId
        ? this.postService.updatePost(this.postId, payload)
        : this.postService.createPost(payload);

      request$.subscribe({
        next: res => {
          this.saving = false;
          this.saved.emit();
          this.router.navigate(['/posts', res.id]);
          this.close();
        },
        error: err => {
          this.handleError(err);
        },
      });

    } catch (err: any) {
      this.dialogTitle = 'Media error';
      this.dialogMessage =
        err.message === 'INVALID_FILE_TYPE'
          ? 'Only image and MP4 video files are allowed.'
          : 'Failed to process media files.';
      this.showDialogMessage = true;
      this.saving = false;
    }
  }

  private handleError(err: any): void {
    this.dialogTitle = 'Failed';
    this.dialogMessage =
      err?.error?.message || 'Failed to submit post';
    this.showDialogMessage = true;
    this.saving = false;
  }

  close(): void {
    this.visible = false;
    this.closed.emit();
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  onClosedDialog(): void {
    this.showDialogMessage = false;
  }
}
