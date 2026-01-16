import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../dto/user-dto';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    private baseUrl = 'http://localhost:8080/users';

    constructor(private http: HttpClient) { }

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
}