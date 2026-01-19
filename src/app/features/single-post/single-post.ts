import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgForOf, NgFor } from '@angular/common';
import { Header } from '../../components/header/header';
import { PostService } from '../../services/post.service';
import { Post } from '../../components/post/post';
import { PostResponseDto } from '../../dto/post-dto';

@Component({
  selector: 'app-post-page',
  standalone: true,
  imports: [Post, NgIf, Header],
  templateUrl: './single-post.html'
})
export class PostPageComponent implements OnInit {
  post?: PostResponseDto;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(postId);


    this.postService.getPostById(postId).subscribe({
      next: post => {
        console.log(post);
        this.post = post;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
