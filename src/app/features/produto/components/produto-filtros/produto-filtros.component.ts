import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'ob-produto-filtros',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule],
  template: `
    <form class="filtros" [formGroup]="form" (ngSubmit)="buscar.emit(form.getRawValue().filtro)">
      <mat-form-field appearance="outline">
        <mat-label>Buscar produto</mat-label>
        <input matInput formControlName="filtro" placeholder="Descrição, código interno..." />
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>
      <button mat-stroked-button type="submit">Buscar</button>
    </form>
  `,
  styles: [`
    .filtros { display: flex; gap: 12px; align-items: center; }
    mat-form-field { flex: 1; }
    @media (max-width: 768px) { .filtros { flex-direction: column; align-items: stretch; } }
  `]
})
export class ProdutoFiltrosComponent {
  @Output() buscar = new EventEmitter<string>();
  form = this.fb.nonNullable.group({ filtro: [''] });
  constructor(private readonly fb: FormBuilder) {}
}
