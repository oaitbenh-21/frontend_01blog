import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private baseUrl = 'http://localhost:8080/notifications';

    constructor(private http: HttpClient) { }

    getNotifications(): Observable<NotificationDto[]> {
        return this.http.get<NotificationDto[]>(this.baseUrl);
    }

    markAsRead(notificationId: number): Observable<{ message: string }> {
        return this.http.put<{ message: string }>(`${this.baseUrl}/${notificationId}/read`, {});
    }
}