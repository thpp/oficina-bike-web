import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ProdutoListagem } from '../../models/produto-listagem.model';

@Component({
  selector: 'ob-produto-tabela',
  standalone: true,
  imports: [NgIf, CurrencyPipe, MatButtonModule, MatIconModule, MatTableModule],
  template: `
    <div class="table-wrapper">
      <table mat-table [dataSource]="produtos" *ngIf="produtos.length">
        <ng-container matColumnDef="descricao">
          <th mat-header-cell *matHeaderCellDef>Descrição</th>
          <td mat-cell *matCellDef="let produto">{{ produto.descricao }}</td>
        </ng-container>

        <ng-container matColumnDef="tipo">
          <th mat-header-cell *matHeaderCellDef>Tipo</th>
          <td mat-cell *matCellDef="let produto">{{ produto.tipo }}</td>
        </ng-container>

        <ng-container matColumnDef="precoVenda">
          <th mat-header-cell *matHeaderCellDef>Preço venda</th>
          <td mat-cell *matCellDef="let produto">{{ produto.precoVenda | currency:'BRL' }}</td>
        </ng-container>

        <ng-container matColumnDef="estoqueAtual">
          <th mat-header-cell *matHeaderCellDef>Estoque</th>
          <td mat-cell *matCellDef="let produto">{{ produto.estoqueAtual }}</td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let produto">
            <span class="badge" [class.inactive]="!produto.ativo">{{ produto.ativo ? 'Ativo' : 'Inativo' }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="acoes">
          <th mat-header-cell *matHeaderCellDef class="actions">Ações</th>
          <td mat-cell *matCellDef="let produto" class="actions">
            <button mat-icon-button title="Editar" (click)="editar.emit(produto.id)">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button title="Inativar" (click)="inativar.emit(produto.id)">
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
export class ProdutoTabelaComponent {
  @Input({ required: true }) produtos: ProdutoListagem[] = [];
  @Output() editar = new EventEmitter<string>();
  @Output() inativar = new EventEmitter<string>();
  colunas = ['descricao', 'tipo', 'precoVenda', 'estoqueAtual', 'status', 'acoes'];
}
