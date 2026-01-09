import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface UserProfile {
    id: number;
    username: string;
    email: string;
    bio: string;
    role: string;
    posts: PostResponseDto[];
}

interface UserDto {
    id: number;
    username: string;
    avatar: string;
    email: string;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = 'http://localhost:8080/users';

    constructor(private http: HttpClient) { }

    getUserProfile(userId: number): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${this.baseUrl}/users/${userId}`);
    }

    getAllUsers(): Observable<UserDto[]> {
        return this.http.get<UserDto[]>(`${this.baseUrl}/admin/users`);
    }
}
