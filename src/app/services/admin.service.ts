import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private baseUrl = 'http://localhost:8080/admin';

    constructor(private http: HttpClient) { }

    getAnalytics(): Observable<AnalyticsDto> {
        return this.http.get<AnalyticsDto>(`${this.baseUrl}/analytics`);
    }
    getAllUsers(): Observable<UserDto[]> {
        return this.http.get<UserDto[]>(`${this.baseUrl}/users`);
    }
    getAllReports(): Observable<ReportDto[]> {
        return this.http.get<ReportDto[]>(`${this.baseUrl}/reports`);
    }
}
