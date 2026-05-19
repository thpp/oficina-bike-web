import { Routes } from '@angular/router';
import { permissionGuard } from '../../core/guards/permission.guard';
import { Permissao } from '../../core/auth/permissao.enum';

export const PRODUTO_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/produto-listagem/produto-listagem.component').then(c => c.ProdutoListagemComponent),
    canActivate: [permissionGuard(Permissao.PRODUTO_VISUALIZAR)]
  },
  {
    path: 'novo',
    loadComponent: () => import('./pages/produto-cadastro/produto-cadastro.component').then(c => c.ProdutoCadastroComponent),
    canActivate: [permissionGuard(Permissao.PRODUTO_CRIAR)]
  },
  {
    path: 'editar/:id',
    loadComponent: () => import('./pages/produto-edicao/produto-edicao.component').then(c => c.ProdutoEdicaoComponent),
    canActivate: [permissionGuard(Permissao.PRODUTO_EDITAR)]
  }
];
