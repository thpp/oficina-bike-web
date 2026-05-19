import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ProdutoFormComponent } from '../../components/produto-form/produto-form.component';
import { ProdutoCommand } from '../../models/produto-command.model';
import { ProdutoCommandService } from '../../services/produto-command.service';

@Component({
  selector: 'ob-produto-cadastro',
  standalone: true,
  imports: [PageHeaderComponent, ProdutoFormComponent],
  template: `
    <section class="ob-page">
      <ob-page-header
        breadcrumb="Produtos / Novo"
        titulo="Cadastro de Produto"
        descricao="Informe os dados do produto, peça, acessório, bicicleta ou serviço." />

      <ob-produto-form
        [salvando]="salvando()"
        textoBotaoSalvar="Salvar"
        (enviar)="salvarProduto($event)"
        (cancelar)="voltar()" />
    </section>
  `
})
export class ProdutoCadastroComponent {
  salvando = signal(false);

  constructor(
    private readonly produtoCommandService: ProdutoCommandService,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar
  ) {}

  salvarProduto(command: ProdutoCommand): void {
    this.salvando.set(true);
    this.produtoCommandService.criar(command).subscribe({
      next: () => {
        this.snackbar.open('Produto salvo com sucesso.', 'Fechar', { duration: 3000, panelClass: ['snackbar-success'] });
        void this.router.navigate(['/produtos']);
      },
      complete: () => this.salvando.set(false)
    });
  }

  voltar(): void {
    void this.router.navigate(['/produtos']);
  }
}
