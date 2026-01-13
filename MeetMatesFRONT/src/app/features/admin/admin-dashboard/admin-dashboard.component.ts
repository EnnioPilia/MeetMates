// Angular
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Core (facades)
import { AdminFacade } from '../../../core/facades/admin/admin.facade';

// Shared components
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { StateHandlerComponent } from '../../../shared-components/state-handler/state-handler.component';

/**
 * Dashboard d’administration de l’application.
 *
 * Ce composant agit comme un point d’entrée
 * pour les fonctionnalités administrateur.
 *
 * Responsabilités :
 * - charger les utilisateurs et les événements via `AdminFacade`
 * - exposer les états (loading, erreur, données) à la vue
 * - permettre la navigation vers les pages d’administration
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    AppButtonComponent,
    StateHandlerComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {

  private facade = inject(AdminFacade);
  private router = inject(Router);

  /** États exposés par la facade */
  readonly users = this.facade.users;
  readonly events = this.facade.events;
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;

  /**
   * Initialise le dashboard :
   * - charge la liste des utilisateurs
   * - charge la liste des événements
   */
  ngOnInit(): void {
    this.facade.loadUsers().subscribe();
    this.facade.loadEvents().subscribe();
  }
  
  /**
   * Navigue vers une page d’administration.
   *
   * @param path Chemin de navigation
   */
  goTo(path: string): void {
    this.router.navigate([path]);
  }
}
