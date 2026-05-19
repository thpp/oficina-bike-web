import { NgIf } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ClienteFiltrosComponent } from '../../components/cliente-filtros/cliente-filtros.component';
import { ClienteTabelaComponent } from '../../components/cliente-tabela/cliente-tabela.component';
import { ClienteListagem } from '../../models/cliente-listagem.model';
import { ClienteCommandService } from '../../services/cliente-command.service';
import { ClienteQueryService } from '../../services/cliente-query.service';

@Component({
  selector: 'ob-cliente-listagem',
  standalone: true,
  imports: [NgIf, MatButtonModule, MatIconModule, MatPaginatorModule, PageHeaderComponent, EmptyStateComponent, LoadingComponent, ClienteFiltrosComponent, ClienteTabelaComponent],
  template: `
    <section class="ob-page">
      <ob-page-header
        breadcrumb="Clientes"
        titulo="Clientes"
        descricao="Gerencie os clientes cadastrados para vendas e ordens de servico.">
        <button mat-flat-button color="primary" (click)="novoCliente()">
          <mat-icon>add</mat-icon>
          Novo Cliente
        </button>
      </ob-page-header>

      <div class="ob-card">
        <ob-cliente-filtros (buscar)="buscar($event)" />
      </div>

      <ob-loading *ngIf="carregando()" />

      <div class="ob-card" *ngIf="!carregando() && clientes().length">
        <ob-cliente-tabela [clientes]="clientes()" (editar)="editarCliente($event)" (excluir)="confirmarExclusao($event)" />
        <mat-paginator [length]="totalElementos()" [pageSize]="pageSize" [pageIndex]="page" [pageSizeOptions]="[5, 10, 20]" (page)="alterarPagina($event)" />
      </div>

      <div class="ob-card" *ngIf="!carregando() && !clientes().length">
        <ob-empty-state icon="groups" titulo="Nenhum cliente encontrado" descricao="Cadastre um novo cliente ou ajuste os filtros da busca.">
          <button mat-flat-button color="primary" (click)="novoCliente()">Novo Cliente</button>
        </ob-empty-state>
      </div>
    </section>
  `
})
export class ClienteListagemComponent implements OnInit {
  clientes = signal<ClienteListagem[]>([]);
  carregando = signal(false);
  totalElementos = signal(0);
  filtro = '';
  page = 0;
  pageSize = 10;

  constructor(
    private readonly clienteQueryService: ClienteQueryService,
    private readonly clienteCommandService: ClienteCommandService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.carregando.set(true);
    this.clienteQueryService.listar(this.filtro, this.page, this.pageSize).subscribe({
      next: (response) => {
        this.clientes.set(response.content);
        this.totalElementos.set(response.totalElements);
      },
      complete: () => this.carregando.set(false)
    });
  }

  buscar(filtro: string): void {
    this.filtro = filtro;
    this.page = 0;
    this.carregarClientes();
  }

  alterarPagina(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.carregarClientes();
  }

  novoCliente(): void {
    void this.router.navigate(['/clientes/novo']);
  }

  editarCliente(id: string): void {
    void this.router.navigate(['/clientes/editar', id]);
  }

  confirmarExclusao(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        titulo: 'Excluir cliente',
        mensagem: 'Deseja realmente excluir este cliente?',
        textoConfirmar: 'Excluir'
      }
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.excluirCliente(id);
      }
    });
  }

  private excluirCliente(id: string): void {
    this.clienteCommandService.excluir(id).subscribe(() => {
      this.snackbar.open('Cliente excluido com sucesso.', 'Fechar', { duration: 3000, panelClass: ['snackbar-success'] });
      this.carregarClientes();
    });
  }
}
