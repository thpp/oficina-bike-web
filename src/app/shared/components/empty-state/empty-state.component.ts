import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'ob-empty-state',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="empty-state">
      <mat-icon>{{ icon }}</mat-icon>
      <strong>{{ titulo }}</strong>
      <p>{{ descricao }}</p>
      <ng-content />
    </div>
  `,
  styles: [`
    .empty-state { text-align: center; padding: 40px 16px; color: var(--ob-muted); }
    mat-icon { width: 48px; height: 48px; font-size: 48px; margin-bottom: 8px; color: var(--ob-primary); }
    strong { display: block; color: var(--ob-text); margin-bottom: 4px; }
    p { margin: 0 0 16px; }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'inventory_2';
  @Input() titulo = 'Nenhum registro encontrado';
  @Input() descricao = 'Não há dados para exibir no momento.';
}
