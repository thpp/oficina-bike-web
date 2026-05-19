import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'ob-login',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule],
  template: `
    <section class="login-page">
      <mat-card class="login-card">
        <div class="brand">
          <div class="brand-icon">OB</div>
          <div>
            <h1>Oficina da Bike</h1>
            <p>Acesse sua conta para continuar.</p>
          </div>
        </div>

        <form [formGroup]="form" (ngSubmit)="entrar()">
          <mat-form-field appearance="outline">
            <mat-label>E-mail</mat-label>
            <input matInput type="email" formControlName="email" />
            <mat-error *ngIf="form.controls.email.hasError('required')">E-mail obrigatório</mat-error>
            <mat-error *ngIf="form.controls.email.hasError('email')">E-mail inválido</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Senha</mat-label>
            <input matInput type="password" formControlName="senha" />
            <mat-error *ngIf="form.controls.senha.hasError('required')">Senha obrigatória</mat-error>
          </mat-form-field>

          <button mat-flat-button color="primary" type="submit" [disabled]="form.invalid || carregando()">
            <mat-spinner *ngIf="carregando()" diameter="18" />
            <span>{{ carregando() ? 'Entrando...' : 'Entrar' }}</span>
          </button>

          <button mat-button type="button" (click)="entrarMock()">Entrar com sessão mock local</button>
        </form>
      </mat-card>
    </section>
  `,
  styles: [`
    .login-page { min-height: 100vh; display: grid; place-items: center; padding: 24px; background: linear-gradient(135deg, var(--ob-primary-dark), var(--ob-primary)); }
    .login-card { width: 100%; max-width: 420px; padding: 28px; border-radius: 24px; }
    .brand { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
    .brand-icon { width: 52px; height: 52px; border-radius: 16px; background: var(--ob-accent); display: grid; place-items: center; font-weight: 800; }
    h1 { margin: 0; color: var(--ob-primary-dark); }
    p { margin: 4px 0 0; color: var(--ob-muted); }
    form { display: flex; flex-direction: column; gap: 14px; }
    button[type='submit'] { height: 44px; display: inline-flex; gap: 8px; align-items: center; justify-content: center; }
  `]
})
export class LoginComponent {
  carregando = signal(false);
  form = this.fb.nonNullable.group({
    email: ['admin@oficinabike.local', [Validators.required, Validators.email]],
    senha: ['123456', [Validators.required]]
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  entrar(): void {
    if (this.form.invalid) return;
    this.carregando.set(true);
    this.authService.login(this.form.getRawValue()).subscribe({
      next: () => void this.router.navigate(['/produtos']),
      error: () => this.carregando.set(false),
      complete: () => this.carregando.set(false)
    });
  }

  entrarMock(): void {
    this.authService.usarSessaoMock();
    void this.router.navigate(['/produtos']);
  }
}
