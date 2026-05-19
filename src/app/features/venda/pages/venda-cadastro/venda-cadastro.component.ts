import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { LoadingComponent } from '../../../../shared/components/loading/loading.component';
import { ClienteListagem } from '../../../cliente/models/cliente-listagem.model';
import { ClienteQueryService } from '../../../cliente/services/cliente-query.service';
import { ProdutoListagem } from '../../../produto/models/produto-listagem.model';
import { ProdutoQueryService } from '../../../produto/services/produto-query.service';

interface VendaItem {
  produtoId: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

@Component({
  selector: 'ob-venda-cadastro',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgFor,
    NgIf,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    PageHeaderComponent,
    LoadingComponent
  ],
  template: `
    <section class="ob-page">
      <ob-page-header
        breadcrumb="Vendas"
        titulo="Nova venda"
        descricao="Informe o cliente cadastrado, inclua os produtos vendidos e defina a forma de pagamento." />

      <ob-loading *ngIf="carregando()" />

      <ng-container *ngIf="!carregando()">
        <form class="ob-card venda-form" [formGroup]="vendaForm">
          <div class="ob-form-grid">
            <mat-form-field appearance="outline" class="ob-full">
              <mat-label>Cliente</mat-label>
              <mat-select formControlName="clienteId">
                <mat-option *ngFor="let cliente of clientes()" [value]="cliente.id">
                  {{ cliente.nome }} - {{ cliente.documento }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="vendaForm.controls.clienteId.hasError('required')">Cliente obrigatorio</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Forma de pagamento</mat-label>
              <mat-select formControlName="formaPagamento">
                <mat-option *ngFor="let forma of formasPagamento" [value]="forma">{{ forma }}</mat-option>
              </mat-select>
              <mat-error *ngIf="vendaForm.controls.formaPagamento.hasError('required')">Forma de pagamento obrigatoria</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Numero de parcelas</mat-label>
              <input matInput type="number" min="1" formControlName="parcelas" />
              <mat-error *ngIf="vendaForm.controls.parcelas.hasError('min')">Informe ao menos 1 parcela</mat-error>
            </mat-form-field>
          </div>
        </form>

        <form class="ob-card item-form" [formGroup]="itemForm" (ngSubmit)="adicionarItem()">
          <div class="item-grid">
            <mat-form-field appearance="outline">
              <mat-label>Produto</mat-label>
              <mat-select formControlName="produtoId">
                <mat-option *ngFor="let produto of produtos()" [value]="produto.id">
                  {{ produto.descricao }} - {{ produto.precoVenda | currency:'BRL' }}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="itemForm.controls.produtoId.hasError('required')">Produto obrigatorio</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Quantidade</mat-label>
              <input matInput type="number" min="1" formControlName="quantidade" />
              <mat-error *ngIf="itemForm.controls.quantidade.hasError('min')">Quantidade deve ser maior que zero</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Valor unitario</mat-label>
              <input matInput [value]="produtoSelecionado()?.precoVenda | currency:'BRL'" readonly />
            </mat-form-field>

            <button mat-flat-button color="primary" type="submit" [disabled]="itemForm.invalid">
              <mat-icon>add_shopping_cart</mat-icon>
              Adicionar item
            </button>
          </div>
        </form>

        <div class="ob-card">
          <div class="table-wrapper" *ngIf="itens().length; else semItens">
            <table mat-table [dataSource]="itens()">
              <ng-container matColumnDef="descricao">
                <th mat-header-cell *matHeaderCellDef>Produto</th>
                <td mat-cell *matCellDef="let item">{{ item.descricao }}</td>
              </ng-container>

              <ng-container matColumnDef="quantidade">
                <th mat-header-cell *matHeaderCellDef>Quantidade</th>
                <td mat-cell *matCellDef="let item">{{ item.quantidade }}</td>
              </ng-container>

              <ng-container matColumnDef="valorUnitario">
                <th mat-header-cell *matHeaderCellDef>Valor unitario</th>
                <td mat-cell *matCellDef="let item">{{ item.valorUnitario | currency:'BRL' }}</td>
              </ng-container>

              <ng-container matColumnDef="valorTotal">
                <th mat-header-cell *matHeaderCellDef>Total item</th>
                <td mat-cell *matCellDef="let item">{{ item.valorTotal | currency:'BRL' }}</td>
              </ng-container>

              <ng-container matColumnDef="acoes">
                <th mat-header-cell *matHeaderCellDef class="actions">Acoes</th>
                <td mat-cell *matCellDef="let item; let i = index" class="actions">
                  <button mat-icon-button type="button" title="Remover item" (click)="removerItem(i)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="colunas"></tr>
              <tr mat-row *matRowDef="let row; columns: colunas;"></tr>
            </table>
          </div>

          <ng-template #semItens>
            <div class="empty-items">
              <mat-icon>shopping_cart</mat-icon>
              <strong>Nenhum item adicionado</strong>
              <span>Selecione um produto cadastrado, informe a quantidade e adicione a venda.</span>
            </div>
          </ng-template>

          <div class="resumo">
            <div>
              <span>Valor total da compra</span>
              <strong>{{ totalCompra() | currency:'BRL' }}</strong>
            </div>
            <div>
              <span>Valor por parcela</span>
              <strong>{{ valorParcela() | currency:'BRL' }}</strong>
            </div>
            <button mat-flat-button color="primary" type="button" (click)="finalizarVenda()" [disabled]="vendaForm.invalid || !itens().length">
              <mat-icon>check_circle</mat-icon>
              Finalizar venda
            </button>
          </div>
        </div>
      </ng-container>
    </section>
  `,
  styles: [`
    .venda-form, .item-form { display: flex; flex-direction: column; gap: 16px; }
    .item-grid { display: grid; grid-template-columns: minmax(240px, 1fr) 160px 180px auto; gap: 16px; align-items: start; }
    .item-grid button { height: 56px; display: inline-flex; align-items: center; gap: 8px; white-space: nowrap; }
    .table-wrapper { overflow: auto; }
    table { width: 100%; }
    .actions { text-align: right; white-space: nowrap; }
    .empty-items { min-height: 160px; display: grid; place-items: center; align-content: center; gap: 8px; color: var(--ob-muted); text-align: center; }
    .empty-items mat-icon { width: 40px; height: 40px; font-size: 40px; color: var(--ob-primary); }
    .resumo { margin-top: 18px; padding-top: 18px; border-top: 1px solid rgba(107, 114, 128, .2); display: flex; align-items: center; justify-content: flex-end; gap: 24px; flex-wrap: wrap; }
    .resumo div { display: grid; gap: 4px; min-width: 180px; }
    .resumo span { color: var(--ob-muted); font-size: 13px; }
    .resumo strong { color: var(--ob-primary-dark); font-size: 22px; }
    .resumo button { height: 44px; display: inline-flex; align-items: center; gap: 8px; }
    @media (max-width: 1024px) { .item-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
    @media (max-width: 768px) {
      .item-grid { grid-template-columns: 1fr; }
      .item-grid button { width: 100%; justify-content: center; }
      .resumo { justify-content: stretch; }
      .resumo div, .resumo button { width: 100%; }
    }
  `]
})
export class VendaCadastroComponent implements OnInit {
  clientes = signal<ClienteListagem[]>([]);
  produtos = signal<ProdutoListagem[]>([]);
  itens = signal<VendaItem[]>([]);
  carregando = signal(false);

  colunas = ['descricao', 'quantidade', 'valorUnitario', 'valorTotal', 'acoes'];
  formasPagamento = ['Dinheiro', 'Pix', 'Cartao de debito', 'Cartao de credito', 'Boleto'];

  vendaForm = this.fb.nonNullable.group({
    clienteId: ['', Validators.required],
    formaPagamento: ['Pix', Validators.required],
    parcelas: [1, [Validators.required, Validators.min(1)]]
  });

  itemForm = this.fb.nonNullable.group({
    produtoId: ['', Validators.required],
    quantidade: [1, [Validators.required, Validators.min(1)]]
  });

  totalCompra = computed(() => this.itens().reduce((total, item) => total + item.valorTotal, 0));

  constructor(
    private readonly fb: FormBuilder,
    private readonly clienteQueryService: ClienteQueryService,
    private readonly produtoQueryService: ProdutoQueryService,
    private readonly snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando.set(true);
    forkJoin({
      clientes: this.clienteQueryService.listar('', 0, 100),
      produtos: this.produtoQueryService.listar('', 0, 100)
    }).subscribe({
      next: ({ clientes, produtos }) => {
        this.clientes.set(clientes.content.filter(cliente => cliente.ativo));
        this.produtos.set(produtos.content.filter(produto => produto.ativo));
      },
      complete: () => this.carregando.set(false)
    });
  }

  adicionarItem(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const produto = this.produtoSelecionado();
    if (!produto) return;

    const quantidade = this.itemForm.controls.quantidade.value;
    const itemExistente = this.itens().find(item => item.produtoId === produto.id);
    const quantidadeFinal = quantidade + (itemExistente?.quantidade ?? 0);
    const novoItem: VendaItem = {
      produtoId: produto.id,
      descricao: produto.descricao,
      quantidade: quantidadeFinal,
      valorUnitario: produto.precoVenda,
      valorTotal: quantidadeFinal * produto.precoVenda
    };

    this.itens.update(itens => itemExistente
      ? itens.map(item => item.produtoId === produto.id ? novoItem : item)
      : [...itens, novoItem]
    );
    this.itemForm.reset({ produtoId: '', quantidade: 1 });
  }

  produtoSelecionado(): ProdutoListagem | undefined {
    return this.produtos().find(produto => produto.id === this.itemForm.controls.produtoId.value);
  }

  valorParcela(): number {
    return this.totalCompra() / Math.max(1, this.vendaForm.controls.parcelas.value || 1);
  }

  removerItem(index: number): void {
    this.itens.update(itens => itens.filter((_, itemIndex) => itemIndex !== index));
  }

  finalizarVenda(): void {
    if (this.vendaForm.invalid || !this.itens().length) {
      this.vendaForm.markAllAsTouched();
      return;
    }

    this.snackbar.open('Venda registrada com sucesso.', 'Fechar', { duration: 3000, panelClass: ['snackbar-success'] });
    this.vendaForm.reset({ clienteId: '', formaPagamento: 'Pix', parcelas: 1 });
    this.itemForm.reset({ produtoId: '', quantidade: 1 });
    this.itens.set([]);
  }
}
