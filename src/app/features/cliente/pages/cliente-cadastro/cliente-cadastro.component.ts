import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ClienteFormComponent } from '../../components/cliente-form/cliente-form.component';
import { ClienteCommand } from '../../models/cliente-command.model';
import { ClienteCommandService } from '../../services/cliente-command.service';

@Component({
  selector: 'ob-cliente-cadastro',
  standalone: true,
  imports: [PageHeaderComponent, ClienteFormComponent],
  template: `
    <section class="ob-page">
      <ob-page-header
        breadcrumb="Clientes / Novo"
        titulo="Cadastro de Cliente"
        descricao="Informe os dados de contato e identificacao do cliente." />

      <ob-cliente-form
        [salvando]="salvando()"
        textoBotaoSalvar="Salvar"
        (enviar)="salvarCliente($event)"
        (cancelar)="voltar()" />
    </section>
  `
})
export class ClienteCadastroComponent {
  salvando = signal(false);

  constructor(
    private readonly clienteCommandService: ClienteCommandService,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar
  ) {}

  salvarCliente(command: ClienteCommand): void {
    this.salvando.set(true);
    this.clienteCommandService.criar(command).subscribe({
      next: () => {
        this.snackbar.open('Cliente salvo com sucesso.', 'Fechar', { duration: 3000, panelClass: ['snackbar-success'] });
        void this.router.navigate(['/clientes']);
      },
      complete: () => this.salvando.set(false)
    });
  }

  voltar(): void {
    void this.router.navigate(['/clientes']);
  }
}
