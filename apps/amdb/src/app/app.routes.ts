import { Route } from '@angular/router';
import { AuthGuard } from '@amdb/auth';

export const appRoutes: Route[] = [
  {
    path: 'login',
    loadComponent: () => import('@amdb/login').then((m) => m.Login),
  },
  {
    path: 'signup',
    loadComponent: () => import('@amdb/signup').then((m) => m.Signup),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('@amdb/landing').then((m) => m.Landing),
  },
];
