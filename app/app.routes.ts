import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login }
    // { path: 'profile/:id', component: Home },
    // { path: 'notification', component: Home },
    // { path: 'media/:img', component: Home },
    // { path: 'posts/:id', component: Home },
];
