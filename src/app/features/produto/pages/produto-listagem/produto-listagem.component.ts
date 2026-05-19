import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ProdutoFiltrosComponent } from '../../components/produto-filtros/produto-filtros.component';
import { ProdutoTabelaComponent } from '../../components/produto-tabela/produto-tabela.component';
import { ProdutoListagem } from '../../models/produto-listagem.model';
import { ProdutoQueryService } from '../../services/produto-query.service';
import { ProdutoCommandService } from '../../services/produto-command.service';

@Component({
  selector: 'ob-produto-listagem',
  standalone: true,
  imports: [NgIf, MatButtonModule, MatIconModule, MatPaginatorModule, PageHeaderComponent, EmptyStateComponent, LoadingComponent, ProdutoFiltrosComponent, ProdutoTabelaComponent],
  template: `
    <section class="ob-page">
      <ob-page-header
        breadcrumb="Produtos"
        titulo="Produtos"
        descricao="Gerencie bicicletas, peças, acessórios e serviços cadastrados.">
        <button mat-flat-button color="primary" (click)="novoProduto()">
          <mat-icon>add</mat-icon>
          Novo Produto
        </button>
      </ob-page-header>

      <div class="ob-card">
        <ob-produto-filtros (buscar)="buscar($event)" />
      </div>

      <ob-loading *ngIf="carregando()" />

      <div class="ob-card" *ngIf="!carregando() && produtos().length">
        <ob-produto-tabela [produtos]="produtos()" (editar)="editarProduto($event)" (inativar)="confirmarInativacao($event)" />
        <mat-paginator [length]="totalElementos()" [pageSize]="pageSize" [pageIndex]="page" [pageSizeOptions]="[5, 10, 20]" (page)="alterarPagina($event)" />
      </div>

      <div class="ob-card" *ngIf="!carregando() && !produtos().length">
        <ob-empty-state titulo="Nenhum produto encontrado" descricao="Cadastre um novo produto ou ajuste os filtros da busca.">
          <button mat-flat-button color="primary" (click)="novoProduto()">Novo Produto</button>
        </ob-empty-state>
      </div>
    </section>
  `
})
export class ProdutoListagemComponent implements OnInit {
  produtos = signal<ProdutoListagem[]>([]);
  carregando = signal(false);
  totalElementos = signal(0);
  filtro = '';
  page = 0;
  pageSize = 10;

  constructor(
    private readonly produtoQueryService: ProdutoQueryService,
    private readonly produtoCommandService: ProdutoCommandService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando.set(true);
    this.produtoQueryService.listar(this.filtro, this.page, this.pageSize).subscribe({
      next: (response) => {
        this.produtos.set(response.content);
        this.totalElementos.set(response.totalElements);
      },
      complete: () => this.carregando.set(false)
    });
  }

  buscar(filtro: string): void {
    this.filtro = filtro;
    this.page = 0;
    this.carregarProdutos();
  }

  alterarPagina(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarProdutos();
  }

  novoProduto(): void {
    void this.router.navigate(['/produtos/novo']);
  }

  editarProduto(id: string): void {
    void this.router.navigate(['/produtos/editar', id]);
  }

  confirmarInativacao(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Inativar produto',
        mensagem: 'Deseja realmente inativar este produto?',
        textoConfirmar: 'Inativar'
      }
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.inativarProduto(id);
      }
    });
  }

  private inativarProduto(id: string): void {
    this.produtoCommandService.inativar(id).subscribe(() => {
      this.snackbar.open('Produto inativado com sucesso.', 'Fechar', { duration: 3000, panelClass: ['snackbar-success'] });
      this.carregarProdutos();
    });
  }
}
