import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Home } from './features/home/home';
import { PostPageComponent } from './features/single-post/single-post';
import { LogoutComponent } from './features/logout/logout';
import { Dashboard } from './features/dashboard/dashboard';
import { Register } from './features/register/register';
import { Profile } from './features/profile/profile';
import { Header } from './components/header/header';
import { FloatingReport } from './components/report/report';
import { EditProfileComponent } from './components/edit-profile/edit-profile';
import { Notification } from './components/notification/notification';
import { AuthGuard } from './guards/auth-guard';
import { AdminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: 'report', component: FloatingReport, canActivate: [AuthGuard] },
  { path: '', component: Home, canActivate: [AuthGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'posts/:id', component: PostPageComponent, canActivate: [AuthGuard] },
  { path: 'profile/edit', component: EditProfileComponent, canActivate: [AuthGuard] },
  { path: 'notification', component: Notification, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: Profile, canActivate: [AuthGuard] },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  { path: 'admin/dashboard', component: Dashboard, canActivate: [AdminGuard] },
  { path: 'header', component: Header, canActivate: [AuthGuard] },
];
