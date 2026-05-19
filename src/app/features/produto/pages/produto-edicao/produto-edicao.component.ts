import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ProdutoFormComponent } from '../../components/produto-form/produto-form.component';
import { ProdutoCommand } from '../../models/produto-command.model';
import { ProdutoDetalhe } from '../../models/produto-detalhe.model';
import { ProdutoCommandService } from '../../services/produto-command.service';
import { ProdutoQueryService } from '../../services/produto-query.service';

@Component({
  selector: 'ob-produto-edicao',
  standalone: true,
  imports: [NgIf, PageHeaderComponent, LoadingComponent, ProdutoFormComponent],
  template: `
    <section class="ob-page">
      <ob-page-header
        breadcrumb="Produtos / Edição"
        titulo="Edição de Produto"
        descricao="Atualize os dados do produto selecionado." />

      <ob-loading *ngIf="carregando()" />

      <ob-produto-form
        *ngIf="!carregando() && produto()"
        [produto]="produto()!"
        [salvando]="salvando()"
        textoBotaoSalvar="Salvar Alterações"
        (enviar)="atualizarProduto($event)"
        (cancelar)="voltar()" />
    </section>
  `
})
export class ProdutoEdicaoComponent implements OnInit {
  produto = signal<ProdutoDetalhe | undefined>(undefined);
  carregando = signal(false);
  salvando = signal(false);
  private id = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly produtoQueryService: ProdutoQueryService,
    private readonly produtoCommandService: ProdutoCommandService,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.carregarProduto();
  }

  carregarProduto(): void {
    this.carregando.set(true);
    this.produtoQueryService.buscarPorId(this.id).subscribe({
      next: (produto) => this.produto.set(produto),
      complete: () => this.carregando.set(false)
    });
  }

  atualizarProduto(command: ProdutoCommand): void {
    this.salvando.set(true);
    this.produtoCommandService.atualizar(this.id, command).subscribe({
      next: () => {
        this.snackbar.open('Produto atualizado com sucesso.', 'Fechar', { duration: 3000, panelClass: ['snackbar-success'] });
        void this.router.navigate(['/produtos']);
      },
      complete: () => this.salvando.set(false)
    });
  }

  voltar(): void {
    void this.router.navigate(['/produtos']);
  }
}
