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

    markAsRead(notificationId: number): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/${notificationId}/read`, {});
    }

    markAsUnread(notificationId: number): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/${notificationId}/unread`, {});
    }

    deleteNotification(notificationId: number): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/${notificationId}/delete`, {});
    }

    markAllRead(): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/markAllRead`, {});
    }
}