import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorDto, UpdateUserDto, UserDto } from '../dto/user-dto';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = 'http://localhost:8080/users';
    private user!: AuthorDto;

    constructor(private http: HttpClient) { }

    setUser(user: AuthorDto) {
        this.user = user;
    }

    getUser() {
        return this.user || { id: 0, username: 'UNKNOWN', email: 'example@gmail.com', role: 'NONE', avatar: '' };
    }
    
    getCurrentUser() {
        return this.http.get<AuthorDto>(`${this.baseUrl}/me`);
    }

    getUserProfile(userId: number): Observable<UserDto> {
        return this.http.get<UserDto>(`${this.baseUrl}/${userId}`);
    }
    getAllUsers() {
        return this.http.get<UserDto[]>(`${this.baseUrl}`);
    }

    subscribeToUser(userId: number): Observable<string> {
        return this.http.post<string>(`${this.baseUrl}/${userId}/subscribe`, {});
    }

    unsubscribeFromUser(userId: number): Observable<string> {
        return this.http.delete<string>(`${this.baseUrl}/${userId}/unsubscribe`, {});
    }

    updateProfile(updatedUser: UpdateUserDto): Observable<void> {
        return this.http.put<void>(`${this.baseUrl}/me`, updatedUser);
    }
}