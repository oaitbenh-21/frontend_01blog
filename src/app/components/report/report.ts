import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReportService } from '../../services/report.service';
import { ReportRequestDto } from '../../dto/report-dto';
import { NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report',
  imports: [NgStyle, FormsModule],
  templateUrl: './report.html',
  styleUrls: ['./report.scss'],
})
export class FloatingReport {
  @Input() visible: boolean = true;
  @Input() id: number = 0;
  @Input() user: boolean = true;
  @Input() message: string = '';
  @Output() closed = new EventEmitter<void>();
  @Output() reported = new EventEmitter<ReportRequestDto>();

  statusMessage: string = '';

  constructor(private reportService: ReportService) {}

  get title(): string {
    return `Are you sure you want to report this ${this.user ? 'user' : 'post'} ${this.id}?`;
  }

  close() {
    this.visible = false;
    this.closed.emit();
    this.statusMessage = '';
    this.message = '';
  }

  onConfirm() {
    this.statusMessage = '';
    if (!this.message.trim()) {
      this.statusMessage = 'Please provide a reason for reporting.';
      return;
    }

    const report: ReportRequestDto = {
      userid: this.id,
      postid: this.id,
      reason: this.message.trim(),
    };
    this.reported.emit(report);
  }
}
