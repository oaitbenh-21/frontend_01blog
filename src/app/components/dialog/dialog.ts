import { NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [NgStyle],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class FloatingDialog {
  @Input() visible: boolean = false;
  @Input() title: string = 'Warning';
  @Input() message: string = 'Are you sure you want to proceed?';

  @Output() closed = new EventEmitter<void>();

  close() {
    this.visible = false;
    this.closed.emit();
  }
}
