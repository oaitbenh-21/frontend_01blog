import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { PostPageComponent } from './features/single-post/single-post';
import { CreatePostComponent } from './features/create-post/create-post';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: Login },
    { path: 'posts/create', component: CreatePostComponent },
    { path: 'posts/:id', component: PostPageComponent },
    // { path: 'notification', component: Home },
    // { path: 'media/:img', component: Home },
    // { path: 'posts/:id', component: Home },
];
