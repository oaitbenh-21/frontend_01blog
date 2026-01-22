import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { PostPageComponent } from './features/single-post/single-post';
import { CreatePostComponent } from './features/create-post/create-post';
import { LogoutComponent } from './features/logout/logout';
import { Dashboard } from './features/dashboard/dashboard';
import { Register } from './features/register/register';
import { Profile } from './features/profile/profile';
import { Header } from './components/header/header';
import { FloatingReport } from './components/report/report';

export const routes: Routes = [
  { path: 'report', component: FloatingReport },
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'posts/add', component: CreatePostComponent },
  { path: 'posts/:id', component: PostPageComponent },
  { path: 'profile/:id', component: Profile },
  { path: 'logout', component: LogoutComponent },
  { path: 'admin/dashboard', component: Dashboard },
  { path: 'header', component: Header },

  // { path: 'notification', component: Home },
];
