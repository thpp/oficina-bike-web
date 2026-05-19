import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ClienteListagem } from '../../models/cliente-listagem.model';

@Component({
  selector: 'ob-cliente-tabela',
  standalone: true,
  imports: [NgIf, MatButtonModule, MatIconModule, MatTableModule],
  template: `
    <div class="table-wrapper">
      <table mat-table [dataSource]="clientes" *ngIf="clientes.length">
        <ng-container matColumnDef="nome">
          <th mat-header-cell *matHeaderCellDef>Nome</th>
          <td mat-cell *matCellDef="let cliente">{{ cliente.nome }}</td>
        </ng-container>

        <ng-container matColumnDef="documento">
          <th mat-header-cell *matHeaderCellDef>Documento</th>
          <td mat-cell *matCellDef="let cliente">{{ cliente.documento }}</td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef>E-mail</th>
          <td mat-cell *matCellDef="let cliente">{{ cliente.email }}</td>
        </ng-container>

        <ng-container matColumnDef="telefone">
          <th mat-header-cell *matHeaderCellDef>Telefone</th>
          <td mat-cell *matCellDef="let cliente">{{ cliente.telefone }}</td>
        </ng-container>

        <ng-container matColumnDef="cidade">
          <th mat-header-cell *matHeaderCellDef>Cidade</th>
          <td mat-cell *matCellDef="let cliente">{{ cliente.cidade }}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let cliente">
            <span class="badge" [class.inactive]="!cliente.ativo">{{ cliente.ativo ? 'Ativo' : 'Inativo' }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="acoes">
          <th mat-header-cell *matHeaderCellDef class="actions">Acoes</th>
          <td mat-cell *matCellDef="let cliente" class="actions">
            <button mat-icon-button title="Editar" (click)="editar.emit(cliente.id)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button title="Excluir" (click)="excluir.emit(cliente.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="colunas"></tr>
        <tr mat-row *matRowDef="let row; columns: colunas;"></tr>
      </table>
    </div>
  `,
  styles: [`
    .table-wrapper { overflow: auto; }
    table { width: 100%; }
    .actions { text-align: right; white-space: nowrap; }
    .badge { display: inline-flex; padding: 4px 10px; border-radius: 999px; background: rgba(22, 163, 74, .12); color: var(--ob-success); font-weight: 600; font-size: 12px; }
    .badge.inactive { background: rgba(107, 114, 128, .12); color: var(--ob-muted); }
  `]
})
export class ClienteTabelaComponent {
  @Input({ required: true }) clientes: ClienteListagem[] = [];
  @Output() editar = new EventEmitter<string>();
  @Output() excluir = new EventEmitter<string>();
  colunas = ['nome', 'documento', 'email', 'telefone', 'cidade', 'status', 'acoes'];
}
