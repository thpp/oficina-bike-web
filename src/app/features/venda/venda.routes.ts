import { Routes } from '@angular/router';
import { Permissao } from '../../core/auth/permissao.enum';
import { permissionGuard } from '../../core/guards/permission.guard';

export const VENDA_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/venda-cadastro/venda-cadastro.component').then(c => c.VendaCadastroComponent),
    canActivate: [permissionGuard(Permissao.VENDA_CRIAR)]
  }
];
