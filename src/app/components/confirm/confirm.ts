import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './confirm.html',
  styleUrls: ['./confirm.scss'],
})
export class FloatingComfirm {
  @Input() visible: boolean = false;
  title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to proceed?';

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();

  close() {
    this.visible = false;
    this.closed.emit();
  }

  confirm() {
    this.confirmed.emit();
  }
}
