import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'user',
    title: 'User',
    loadComponent: () => import('./user.component'),
  },
];
