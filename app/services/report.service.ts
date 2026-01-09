import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = '/api/reports';

  constructor(private http: HttpClient) {}

  submitReport(report: ReportDto): Observable<ReportDto> {
    return this.http.post<ReportDto>(this.baseUrl, report);
  }

  getAllReports(): Observable<ReportDto[]> {
    return this.http.get<ReportDto[]>(`/api/admin/reports`);
  }
}
