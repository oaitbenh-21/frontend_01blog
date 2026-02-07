import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../components/header/header';
import { PostService } from '../../services/post.service';
import { Post } from '../../components/post/post';
import { PostResponseDto } from '../../dto/post-dto';
import { FormsModule } from '@angular/forms';
import { Security } from '../../services/security';

@Component({
  selector: 'app-post-page',
  standalone: true,
  imports: [Post, Header, FormsModule],
  templateUrl: './single-post.html'
})
export class PostPageComponent implements OnInit {
  post?: PostResponseDto;
  loading = true;
  content: string = '';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public security: Security,
  ) { }

  ngOnInit() {
    const postId = Number(this.route.snapshot.paramMap.get('id'));
    this.postService.getPostById(postId).subscribe({
      next: post => {
        this.post = post;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
  goToProfile(userId: number) {
    this.router.navigate(['/profile', userId]);
  }
  addComment() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.postService.commentOnPost(id, this.content).subscribe({
      next: (value) => {
        this.content = "";
        this.post?.comments.push(value);
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 200) {
          this.post?.comments.push();
          this.content = "";
          this.cdr.detectChanges();
        }
      },
    });

  }

  deleteComment(commentId: number, index: number) {
    this.postService.deleteComment(this.post?.id || 0, commentId).subscribe({
      next: () => {
        this.post?.comments.splice(index, 1);
        this.cdr.detectChanges();
        console.error('delete comment', index);
      },
      error: (err) => {
        console.error('Failed to delete comment', err);
      }
    });
  }
}
