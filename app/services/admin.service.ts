import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = '/api/admin';

  constructor(private http: HttpClient) {}

  getAnalytics(): Observable<AnalyticsDto> {
    return this.http.get<AnalyticsDto>(`${this.baseUrl}/analytics`);
  }
}
