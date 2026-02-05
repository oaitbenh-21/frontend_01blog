import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthHelperService } from '../services/auth-helper.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authHelper: AuthHelperService, private router: Router) { }

    canActivate(): boolean {
        console.log(localStorage.getItem("token"));
        if (this.authHelper.isLoggedIn()) {
            console.log("logged in");
            return true;
        } else {
            console.log("not logged in");
            localStorage.removeItem('token');
            this.router.navigate(['/login']);
            return false;
        }
    }
}
