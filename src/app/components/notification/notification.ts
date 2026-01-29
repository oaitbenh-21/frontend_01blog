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
    this.notifyService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.read = true;
        this.unreadedCount = this.getUnreadedCount();
      },
      error: (err) => {
        console.error('Failed to mark notification read', err);
      }
    });
  }

  markAllAsRead() {
    this.notifyService.markAllRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.unreadedCount = 0;
      },
      error: (err) => {
        console.error('Failed to mark all read', err);
      }
    });
  }

  deleteNotification(id: number) {
    this.notifyService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.unreadedCount = this.getUnreadedCount();
      },
      error: (err) => {
        console.error('Failed to delete notification', err);
      }
    });
  }

  markAsUnread(notification: NotificationDto) {
    this.notifyService.markAsUnread(notification.id).subscribe({
      next: () => {
        notification.read = false;
        this.unreadedCount = this.getUnreadedCount();
      },
      error: (err) => {
        console.error('Failed to mark unread', err);
      }
    });
  }

}
