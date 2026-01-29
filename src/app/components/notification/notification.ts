import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { TimeAgoPipe } from '../../../pipes/timeAgo';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-notification',
  imports: [TimeAgoPipe, NgIf, NgFor],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class Notification implements OnInit {
  unreadedCount = 0;
  constructor(private notifyService: NotificationService) { }
  notifications: NotificationDto[] = [];
  ngOnInit() {
    this.notifyService.getNotifications().subscribe({
      next: (value) => {
        this.notifications = value;
        this.unreadedCount = this.getUnreadedCount();
      },
      error(err) {
        console.log(err);
      },
    })
  }

  getUnreadedCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  markAsRead(notification: NotificationDto) {
    notification.read = true;
    // TODO: call API to update backend
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    // TODO: call API
  }

  deleteNotification(id: number) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    // TODO: call API
  }

}
