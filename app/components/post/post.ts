import { Component } from '@angular/core';

@Component({
  selector: 'app-post',
  imports: [],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post {
  avatar = "https://github.com/mdo.png"
  img = "https://img.freepik.com/premium-photo/red-yellow-leaf-that-is-reflecting-water-surface_1267893-21099.jpg?semt=ais_hybrid&w=740&q=80"
  username = "oaitbenh"
  date = "2 hours ago"
  content = ""
  liked = true
  followed = Math.round(Math.random());
}
