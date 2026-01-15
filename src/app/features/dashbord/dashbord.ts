import { Component } from '@angular/core';
import { UsersTab } from '../../components/users-tab/users-tab';
import { ReportsTab } from '../../components/reports-tab/reports-tab';
import { PostsTab } from '../../components/posts-tab/posts-tab';

@Component({
  selector: 'app-dashbord',
  imports: [UsersTab, ReportsTab, PostsTab],
  templateUrl: './dashbord.html',
  styleUrl: './dashbord.scss',
})
export class Dashbord {

}
