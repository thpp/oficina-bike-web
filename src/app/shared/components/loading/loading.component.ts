import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'ob-loading',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="loading">
      <mat-spinner diameter="36" />
      <span>{{ mensagem }}</span>
    </div>
  `,
  styles: [`
    .loading { display: flex; align-items: center; justify-content: center; gap: 12px; min-height: 220px; color: var(--ob-muted); }
  `]
})
export class LoadingComponent {
  @Input() mensagem = 'Carregando...';
}
