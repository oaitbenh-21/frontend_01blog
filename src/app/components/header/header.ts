import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CreatePostComponent } from '../create-post/create-post';
import { Notification } from "../notification/notification";

@Component({
  selector: 'app-header',
  imports: [NgIf, CreatePostComponent, Notification, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  standalone: true,
})
export class Header implements OnInit {
  postContent = '';
  postDescription = '';
  postFiles: string[] = [];
  postId = 0;
  showCreatePost = false;

  constructor(
    public userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.userService.setUser(user);
      this.cdr.detectChanges();
    });
  }

  openCreatePost() {
    this.showCreatePost = true;
    this.cdr.detectChanges();
  }

  closeCreatePost() {
    this.showCreatePost = false;
  }

}
