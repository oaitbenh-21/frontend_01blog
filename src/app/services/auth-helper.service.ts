import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    sub: string;
    exp: number;
    iat: number;
    role: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthHelperService {
    getToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const decoded: JwtPayload = jwtDecode(token);
            return decoded.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }

    getUserRole(): string | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const decoded: JwtPayload = jwtDecode(token);
            return decoded.role;
        } catch {
            return null;
        }
    }
}
