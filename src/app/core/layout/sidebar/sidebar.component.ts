import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'ob-sidebar',
  standalone: true,
  imports: [NgIf, RouterLink, RouterLinkActive, MatIconModule, MatButtonModule],
  template: `
    <aside class="sidebar" [class.collapsed]="collapsed">
      <div class="brand">
        <div class="brand-icon">OB</div>
        <strong *ngIf="!collapsed">Oficina da Bike</strong>
      </div>

      <nav>
        <a routerLink="/produtos" routerLinkActive="active">
          <mat-icon>inventory_2</mat-icon>
          <span *ngIf="!collapsed">Produtos</span>
        </a>
        <a routerLink="/clientes" routerLinkActive="active">
          <mat-icon>groups</mat-icon>
          <span *ngIf="!collapsed">Clientes</span>
        </a>
        <a routerLink="/vendas" routerLinkActive="active">
          <mat-icon>point_of_sale</mat-icon>
          <span *ngIf="!collapsed">Vendas</span>
        </a>
        <a class="disabled">
          <mat-icon>payments</mat-icon>
          <span *ngIf="!collapsed">Financeiro</span>
        </a>
      </nav>

      <button mat-icon-button class="toggle" (click)="toggle.emit()" aria-label="Expandir ou recolher menu">
        <mat-icon>{{ collapsed ? 'chevron_right' : 'chevron_left' }}</mat-icon>
      </button>
    </aside>
  `,
  styles: [`
    .sidebar { width: 260px; min-height: 100vh; background: var(--ob-primary-dark); color: #fff; display: flex; flex-direction: column; transition: width .2s ease; position: sticky; top: 0; }
    .sidebar.collapsed { width: 80px; }
    .brand { height: 72px; display: flex; align-items: center; gap: 12px; padding: 0 18px; }
    .brand-icon { width: 40px; height: 40px; border-radius: 12px; background: var(--ob-accent); color: #111827; display: grid; place-items: center; font-weight: 700; }
    nav { display: flex; flex-direction: column; gap: 6px; padding: 12px; }
    a { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; color: #dbeafe; text-decoration: none; }
    a.active, a:hover { background: rgba(255,255,255,.12); color: #fff; }
    a.disabled { opacity: .55; cursor: default; }
    .toggle { margin: auto 16px 16px; color: #fff; align-self: flex-end; }
    .collapsed .toggle { align-self: center; }
    @media (max-width: 768px) { .sidebar { position: fixed; z-index: 20; transform: translateX(-100%); } .sidebar:not(.collapsed) { transform: translateX(0); } .sidebar.collapsed { width: 0; overflow: hidden; } }
  `]
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggle = new EventEmitter<void>();
}
