
import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  imports: [NgClass, NgFor]
})
export class Navbar {
  tabs = ['Following', 'Technology', 'Design', 'Business', 'Science', 'Health', 'Culture'];
  activeTab: string = 'Following';

  setActive(tab: string) {
    this.activeTab = tab;
  }
}
