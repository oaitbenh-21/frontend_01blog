import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { PostPageComponent } from './features/single-post/single-post';
import { CreatePostComponent } from './features/create-post/create-post';
import { LogoutComponent } from './features/logout/logout';
import { Dashbord } from './features/dashbord/dashbord';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'posts/add', component: CreatePostComponent },
    { path: 'posts/:id', component: PostPageComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'admin/dashboard', component: Dashbord },
    // { path: 'notification', component: Home },
    // { path: 'media/:img', component: Home },
    // { path: 'posts/:id', component: Home },
];
