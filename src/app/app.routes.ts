import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { notAuthGuard } from './guards/not-auth.guard';

export const routes: Routes = [
  { path: 'login', canActivate: [notAuthGuard], loadComponent: () => import('./pages/login/login.component').then(mod => mod.LoginComponent) },
  {
    path: '',
    loadComponent: () => import('./layout/layout.component').then(mod => mod.LayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: 'users-list', loadComponent: () => import('./pages/users-list/users-list.component').then(mod => mod.UsersListComponent) },
      { path: '', redirectTo: '/users-list', pathMatch: 'full' },
      { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(mod => mod.NotFoundComponent) },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
