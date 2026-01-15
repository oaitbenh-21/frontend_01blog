import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { UserDto } from '../../dto/user-dto';

@Component({
  selector: 'app-users-tab',
  imports: [NgClass],
  templateUrl: './users-tab.html',
  styleUrl: './users-tab.scss',
})
export class UsersTab {
  users: WritableSignal<UserDto[]> = signal([]);
  constructor(private service: AdminService) { }

  NgONInit() {
    this.service.getAllUsers().subscribe(users => {
      this.users.set(users);
    })
  }
}
