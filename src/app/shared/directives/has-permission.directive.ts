import { Directive, Input, TemplateRef, ViewContainerRef, effect, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Permissao } from '../../core/auth/permissao.enum';

@Directive({
  selector: '[obHasPermission]',
  standalone: true
})
export class HasPermissionDirective {
  private readonly templateRef = inject(TemplateRef<unknown>);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly authService = inject(AuthService);
  private permissao?: Permissao;

  @Input() set obHasPermission(permissao: Permissao) {
    this.permissao = permissao;
    this.atualizarView();
  }

  constructor() {
    effect(() => {
      this.authService.usuario();
      this.atualizarView();
    });
  }

  private atualizarView(): void {
    this.viewContainerRef.clear();
    if (this.permissao && this.authService.temPermissao(this.permissao)) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
}
