import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'ob-page-header',
  standalone: true,
  template: `
    <section class="page-header">
      <div>
        <span class="breadcrumb">{{ breadcrumb }}</span>
        <h1>{{ titulo }}</h1>
        <p *ngIf="descricao">{{ descricao }}</p>
      </div>
      <ng-content />
    </section>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; gap: 16px; align-items: flex-start; flex-wrap: wrap; }
    .breadcrumb { color: var(--ob-muted); font-size: 13px; }
    h1 { margin: 4px 0; font-size: 28px; color: var(--ob-primary-dark); }
    p { margin: 0; color: var(--ob-muted); }
  `],
  imports: [NgIf]
})
export class PageHeaderComponent {
  @Input({ required: true }) titulo = '';
  @Input() descricao = '';
  @Input() breadcrumb = 'Início';
}
