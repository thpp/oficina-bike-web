import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'ob-topbar',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <header class="topbar">
      <button mat-icon-button (click)="menuClick.emit()" aria-label="Abrir menu">
        <mat-icon>menu</mat-icon>
      </button>
      <div class="spacer"></div>
      <span>{{ authService.usuario()?.nome }}</span>
      <button mat-button (click)="authService.logout()">
        <mat-icon>logout</mat-icon>
        Sair
      </button>
    </header>
  `,
  styles: [`
    .topbar { height: 64px; display: flex; align-items: center; gap: 12px; padding: 0 24px; background: #fff; border-bottom: 1px solid #e5e7eb; position: sticky; top: 0; z-index: 10; }
    .spacer { flex: 1; }
    span { color: var(--ob-muted); }
  `]
})
export class TopbarComponent {
  @Output() menuClick = new EventEmitter<void>();
  constructor(public readonly authService: AuthService) {}
}
