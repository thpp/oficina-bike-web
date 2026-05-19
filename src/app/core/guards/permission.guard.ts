import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Permissao } from '../auth/permissao.enum';

export const permissionGuard = (permissao: Permissao): CanActivateFn => () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.temPermissao(permissao)) {
    return true;
  }

  return router.createUrlTree(['/produtos']);
};
