import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClienteCommand } from '../../models/cliente-command.model';
import { ClienteDetalhe } from '../../models/cliente-detalhe.model';

@Component({
  selector: 'ob-cliente-form',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule],
  template: `
    <form class="ob-card" [formGroup]="form" (ngSubmit)="salvar()">
      <div class="ob-form-grid">
        <mat-form-field appearance="outline" class="ob-full">
          <mat-label>Nome</mat-label>
          <input matInput formControlName="nome" />
          <mat-error *ngIf="form.controls.nome.hasError('required')">Nome obrigatorio</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>CPF/CNPJ</mat-label>
          <input matInput formControlName="documento" />
          <mat-error *ngIf="form.controls.documento.hasError('required')">Documento obrigatorio</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Telefone</mat-label>
          <input matInput formControlName="telefone" />
          <mat-error *ngIf="form.controls.telefone.hasError('required')">Telefone obrigatorio</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>E-mail</mat-label>
          <input matInput type="email" formControlName="email" />
          <mat-error *ngIf="form.controls.email.hasError('required')">E-mail obrigatorio</mat-error>
          <mat-error *ngIf="form.controls.email.hasError('email')">E-mail invalido</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Cidade</mat-label>
          <input matInput formControlName="cidade" />
          <mat-error *ngIf="form.controls.cidade.hasError('required')">Cidade obrigatoria</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="ob-full">
          <mat-label>Observacao</mat-label>
          <textarea matInput rows="3" formControlName="observacao"></textarea>
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
    textarea { resize: vertical; }
  `]
})
export class ClienteFormComponent implements OnChanges {
  @Input() cliente?: ClienteDetalhe;
  @Input() salvando = false;
  @Input() textoBotaoSalvar = 'Salvar';
  @Output() enviar = new EventEmitter<ClienteCommand>();
  @Output() cancelar = new EventEmitter<void>();

  form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(256)]],
    documento: ['', [Validators.required, Validators.maxLength(32)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(128)]],
    telefone: ['', [Validators.required, Validators.maxLength(32)]],
    cidade: ['', [Validators.required, Validators.maxLength(128)]],
    observacao: ['', [Validators.maxLength(512)]]
  });

  constructor(private readonly fb: FormBuilder) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cliente'] && this.cliente) {
      this.form.patchValue(this.cliente);
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
