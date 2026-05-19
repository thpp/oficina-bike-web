import { NgIf } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ClienteFormComponent } from '../../components/cliente-form/cliente-form.component';
import { ClienteCommand } from '../../models/cliente-command.model';
import { ClienteDetalhe } from '../../models/cliente-detalhe.model';
import { ClienteCommandService } from '../../services/cliente-command.service';
import { ClienteQueryService } from '../../services/cliente-query.service';

@Component({
  selector: 'ob-cliente-edicao',
  standalone: true,
  imports: [NgIf, PageHeaderComponent, LoadingComponent, ClienteFormComponent],
  template: `
    <section class="ob-page">
      <ob-page-header
        breadcrumb="Clientes / Edicao"
        titulo="Edicao de Cliente"
        descricao="Atualize os dados do cliente selecionado." />

      <ob-loading *ngIf="carregando()" />

      <ob-cliente-form
        *ngIf="!carregando() && cliente()"
        [cliente]="cliente()!"
        [salvando]="salvando()"
        textoBotaoSalvar="Salvar Alteracoes"
        (enviar)="atualizarCliente($event)"
        (cancelar)="voltar()" />
    </section>
  `
})
export class ClienteEdicaoComponent implements OnInit {
  cliente = signal<ClienteDetalhe | undefined>(undefined);
  carregando = signal(false);
  salvando = signal(false);
  private id = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly clienteQueryService: ClienteQueryService,
    private readonly clienteCommandService: ClienteCommandService,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.carregarCliente();
  }

  carregarCliente(): void {
    this.carregando.set(true);
    this.clienteQueryService.buscarPorId(this.id).subscribe({
      next: (cliente) => this.cliente.set(cliente),
      complete: () => this.carregando.set(false)
    });
  }

  atualizarCliente(command: ClienteCommand): void {
    this.salvando.set(true);
    this.clienteCommandService.atualizar(this.id, command).subscribe({
      next: () => {
        this.snackbar.open('Cliente atualizado com sucesso.', 'Fechar', { duration: 3000, panelClass: ['snackbar-success'] });
        void this.router.navigate(['/clientes']);
      },
      complete: () => this.salvando.set(false)
    });
  }

  voltar(): void {
    void this.router.navigate(['/clientes']);
  }
}
