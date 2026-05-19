import { Routes } from '@angular/router';
import { Permissao } from '../../core/auth/permissao.enum';
import { permissionGuard } from '../../core/guards/permission.guard';

export const CLIENTE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/cliente-listagem/cliente-listagem.component').then(c => c.ClienteListagemComponent),
    canActivate: [permissionGuard(Permissao.CLIENTE_VISUALIZAR)]
  },
  {
    path: 'novo',
    loadComponent: () => import('./pages/cliente-cadastro/cliente-cadastro.component').then(c => c.ClienteCadastroComponent),
    canActivate: [permissionGuard(Permissao.CLIENTE_CRIAR)]
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./pages/cliente-edicao/cliente-edicao.component').then(c => c.ClienteEdicaoComponent),
    canActivate: [permissionGuard(Permissao.CLIENTE_EDITAR)]
  }
];
