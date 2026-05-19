import { NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProdutoCommand } from '../../models/produto-command.model';
import { ProdutoDetalhe } from '../../models/produto-detalhe.model';
import { TipoProduto } from '../../enums/tipo-produto.enum';

@Component({
  selector: 'ob-produto-form',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatProgressSpinnerModule],
  template: `
    <form class="ob-card" [formGroup]="form" (ngSubmit)="salvar()">
      <div class="ob-form-grid">
        <mat-form-field appearance="outline" class="ob-full">
          <mat-label>Descrição</mat-label>
          <input matInput formControlName="descricao" />
          <mat-error *ngIf="form.controls.descricao.hasError('required')">Descrição obrigatória</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Código interno</mat-label>
          <input matInput formControlName="codigoInterno" />
          <mat-error *ngIf="form.controls.codigoInterno.hasError('required')">Código obrigatório</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Tipo</mat-label>
          <mat-select formControlName="tipo">
            <mat-option *ngFor="let tipo of tipos" [value]="tipo">{{ tipo }}</mat-option>
          </mat-select>
          <mat-error *ngIf="form.controls.tipo.hasError('required')">Tipo obrigatório</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Preço de custo</mat-label>
          <input matInput type="number" formControlName="precoCusto" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Preço de venda</mat-label>
          <input matInput type="number" formControlName="precoVenda" />
          <mat-error *ngIf="form.controls.precoVenda.hasError('min')">Valor deve ser maior que zero</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Estoque atual</mat-label>
          <input matInput type="number" formControlName="estoqueAtual" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Estoque mínimo</mat-label>
          <input matInput type="number" formControlName="estoqueMinimo" />
        </mat-form-field>
      </div>

      <div class="ob-actions">
        <button mat-button type="button" (click)="cancelar.emit()" [disabled]="salvando">Cancelar</button>
        <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || salvando">
          <mat-spinner *ngIf="salvando" diameter="18" />
          <span>{{ salvando ? 'Salvando...' : textoBotaoSalvar }}</span>
        </button>
      </div>
    </form>
  `,
  styles: [`
    form { display: flex; flex-direction: column; gap: 20px; }
    button[type='submit'] { display: inline-flex; gap: 8px; align-items: center; }
  `]
})
export class ProdutoFormComponent implements OnChanges {
  @Input() produto?: ProdutoDetalhe;
  @Input() salvando = false;
  @Input() textoBotaoSalvar = 'Salvar';
  @Output() enviar = new EventEmitter<ProdutoCommand>();
  @Output() cancelar = new EventEmitter<void>();

  tipos = Object.values(TipoProduto);

  form = this.fb.nonNullable.group({
    descricao: ['', [Validators.required, Validators.maxLength(256)]],
    codigoInterno: ['', [Validators.required, Validators.maxLength(64)]],
    tipo: [TipoProduto.PECA, Validators.required],
    precoCusto: [0, [Validators.min(0)]],
    precoVenda: [0, [Validators.required, Validators.min(0.01)]],
    estoqueAtual: [0, [Validators.min(0)]],
    estoqueMinimo: [0, [Validators.min(0)]],
  });

  constructor(private readonly fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['produto'] && this.produto) {
      this.form.patchValue(this.produto);
    }
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviar.emit(this.form.getRawValue());
  }
}
