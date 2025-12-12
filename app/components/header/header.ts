import { Component } from '@angular/core';
import { NgIf } from "../../../../node_modules/@angular/common/types/_common_module-chunk";

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  avatar = "https://github.com/mdo.png"
  username = "oaitbenh"
  role = "admin"
}
