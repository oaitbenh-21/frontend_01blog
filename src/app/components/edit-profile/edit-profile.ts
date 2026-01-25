import { ChangeDetectorRef, Component, EventEmitter, Input, NgModule, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateUserDto, UserDto } from '../../dto/user-dto';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.html',
  standalone: true,
  styleUrls: ['./edit-profile.scss'],
  imports: [ReactiveFormsModule, CommonModule],
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

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private userService: UserService) { }

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

    const updatedUser: UpdateUserDto = {
      ...this.profileForm.value,
      avatar: this.avatarPreview as string,
    };

    this.userService.updateProfile(updatedUser).subscribe({
      next: () => {
        this.onCancel();
      },
      error: (err) => {
        console.log(JSON.stringify(err));
      }
    });


    console.log(updatedUser);

    setTimeout(() => {
      this.saved.emit({
        ...this.user,
        ...this.profileForm.value,
        avatar: this.avatarPreview as string,
      });
      this.submitting = false;
      this.close.emit();
      this.cdr.detectChanges();
    }, 500);
  }

  onCancel() {
    this.close.emit();
  }
}
