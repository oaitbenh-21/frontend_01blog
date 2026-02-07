import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Security {

  escapeHtml(input: string): string {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }


}
