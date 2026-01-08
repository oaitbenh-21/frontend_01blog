import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostResponseDto } from '../../dto/post-dto';


@Injectable({ providedIn: 'root' })
export class PostService {
  private readonly BASE_URL = 'http://localhost:8080/posts';

  constructor(private http: HttpClient) { }

  getPostById(id: number): Observable<PostResponseDto> {
    return this.http.get<PostResponseDto>(
      `${this.BASE_URL}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }
}
