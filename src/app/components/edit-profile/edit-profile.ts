import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserDto } from '../../dto/user-dto';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.html',
  standalone: true,
  styleUrls: ['./edit-profile.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class EditProfileComponent implements OnChanges {
  @Input() user!: UserDto;
  @Input() visible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<UserDto>();

  profileForm!: FormGroup;
  avatarFile: File | null = null;
  avatarPreview: string | ArrayBuffer | null = null;

  submitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.initForm();
      this.cdr.detectChanges();
    }
  }

  initForm() {
    this.profileForm = this.fb.group({
      username: [this.user.username, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
      bio: [this.user.bio || ''],
    });

    this.avatarPreview = this.user.avatar || null;
    this.avatarFile = null;
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.avatarFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => (this.avatarPreview = reader.result);
      reader.readAsDataURL(this.avatarFile);
    }
  }

  onSubmit() {
    if (!this.profileForm.valid) return;

    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const updatedUser: UserDto = {
      ...this.user,
      ...this.profileForm.value,
      avatar: this.avatarPreview as string,
    };

    // Normally call API here
    setTimeout(() => {
      this.saved.emit(updatedUser);
      this.submitting = false;
      this.close.emit();
      this.cdr.detectChanges();
    }, 500);
  }

  onCancel() {
    this.close.emit();
  }
}
