import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthHelperService } from '../services/auth-helper.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    constructor(private authHelper: AuthHelperService, private router: Router) { }

    canActivate(): boolean {
        if (this.authHelper.isLoggedIn() && this.authHelper.getUserRole() === 'ADMIN') {
            return true;
        } else {
            this.router.navigate(['/']);
            return false;
        }
    }
}
