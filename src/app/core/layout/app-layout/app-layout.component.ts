import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'ob-app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  template: `
    <div class="layout">
      <ob-sidebar [collapsed]="menuCollapsed" (toggle)="toggleMenu()" />
      <div class="main">
        <ob-topbar (menuClick)="toggleMenu()" />
        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .layout { display: flex; min-height: 100vh; background: var(--ob-bg); }
    .main { flex: 1; min-width: 0; }
    .content { padding: 24px; }
    @media (max-width: 768px) { .content { padding: 16px; } }
  `]
})
export class AppLayoutComponent {
  menuCollapsed = false;

  toggleMenu(): void {
    this.menuCollapsed = !this.menuCollapsed;
  }
}
