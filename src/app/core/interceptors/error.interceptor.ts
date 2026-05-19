import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackbar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const mensagem = error.error?.message || error.error?.mensagem || 'Não foi possível processar a solicitação.';
      snackbar.open(mensagem, 'Fechar', {
        duration: 5000,
        panelClass: ['snackbar-error']
      });
      return throwError(() => error);
    })
  );
};
