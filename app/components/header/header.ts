import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  avatar = "https://github.com/mdo.png"
  username = jwtDecode.toString()
  role = "admin"
}
