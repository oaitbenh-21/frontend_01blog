import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-reports-tab',
  imports: [NgFor],
  templateUrl: './reports-tab.html',
  styleUrl: './reports-tab.scss',
})
export class ReportsTab {
  reports: ReportDto[] = [];
  constructor(private service: AdminService, private cdr: ChangeDetectorRef) {
  }
  NgOnInit() {
    this.service.getAllReports().subscribe(reports => {
      this.reports = reports;
      this.cdr.detectChanges();
    })
  }
}
