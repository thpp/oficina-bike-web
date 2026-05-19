import { Routes } from '@angular/router';
import { AppLayoutComponent } from './core/layout/app-layout/app-layout.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(c => c.LoginComponent)
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'produtos' },
      {
        path: 'produtos',
        loadChildren: () => import('./features/produto/produto.routes').then(r => r.PRODUTO_ROUTES)
      },
      {
        path: 'clientes',
        loadChildren: () => import('./features/cliente/cliente.routes').then(r => r.CLIENTE_ROUTES)
      },
      {
        path: 'vendas',
        loadChildren: () => import('./features/venda/venda.routes').then(r => r.VENDA_ROUTES)
      }
    ]
  },
  { path: '**', redirectTo: 'produtos' }
];
