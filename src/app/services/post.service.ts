import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostRequestDto, PostResponseDto } from '../dto/post-dto';
import { CommentRequestDto, CommentResponseDto } from '../dto/comment-dto';

interface LikeResponse {
  message: string;
  likesCount: number;
  likedByCurrentUser: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private baseUrl = 'http://localhost:8080/posts';

  constructor(private http: HttpClient) { }

  createPost(post: PostRequestDto): Observable<PostResponseDto> {
    return this.http.post<PostResponseDto>(this.baseUrl, post);
  }

  getAllPosts(page: number, size: number): Observable<PostResponseDto[]> {
    return this.http.get<PostResponseDto[]>(this.baseUrl, {
      params: new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
    });
  }

  likePost(postId: number): Observable<LikeResponse> {
    return this.http.post<LikeResponse>(`${this.baseUrl}/${postId}/like`, {});
  }

  commentOnPost(postId: number, comment: string): Observable<CommentResponseDto> {
    return this.http.post<CommentResponseDto>(`${this.baseUrl}/${postId}/comment`, { content: comment });
  }
  getPostById(id: number): Observable<PostResponseDto> {
    return this.http.get<PostResponseDto>(`${this.baseUrl}/${id}`, {});
  }
}
