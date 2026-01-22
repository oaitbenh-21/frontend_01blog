import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportDto, ReportRequestDto } from '../dto/report-dto';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private baseUrl = 'http://localhost:8080/reports';

  constructor(private http: HttpClient) {}

  submitReport(report: ReportRequestDto): Observable<string> {
    return this.http.post<string>(this.baseUrl, report);
  }
}
