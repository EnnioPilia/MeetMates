// Angular
import { Injectable, inject, signal } from '@angular/core';
import { tap, finalize } from 'rxjs';

// Core
import { BaseFacade } from '../base/base.facade';
import { AdminService } from '../../services/admin/admin.service';
import { SuccessHandlerService } from '../../services/success-handler/success-handler.service';

// Models
import { User } from '../../models/user.model';
import { EventResponse } from '../../models/event-response.model';

/**
 * Facade responsable des cas d’usage d’administration.
 *
 * Alignée avec EventFacade :
 * - signals
 * - loading centralisé
 * - success handler
 * - aucun subscribe interne
 */
@Injectable({ providedIn: 'root' })
export class AdminFacade extends BaseFacade {

  private adminService = inject(AdminService);
  private successHandler = inject(SuccessHandlerService);

  /** Liste des utilisateurs */
  readonly users = signal<User[]>([]);

  /** Liste des événements */
  readonly events = signal<EventResponse[]>([]);

  /** Indique si une action admin est en cours */
  isSubmitting = false;
  private start() { this.isSubmitting = true; }
  private stop() { this.isSubmitting = false; }

  /* ================= USERS ================= */

  loadUsers() {
    this.startLoading();

    return this.adminService.getAllUsers().pipe(
      tap(res => this.users.set(res.data)),
      finalize(() => this.stopLoading()),
      this.handleError("Impossible de charger les utilisateurs")
    );
  }

  deleteUser(userId: string) {
    this.start();
    this.startLoading();

    return this.adminService.deleteUser(userId).pipe(
      tap(res => this.successHandler.handle(res)),
      tap(() => this.stop()),
      finalize(() => this.stopLoading()),
      this.handleError()
    );
  }

  /* ================= EVENTS ================= */

  loadEvents() {
    this.startLoading();

    return this.adminService.getAllEvents().pipe(
      tap(res => this.events.set(res.data)),
      finalize(() => this.stopLoading()),
      this.handleError("Impossible de charger les événements")
    );
  }

  deleteEvent(eventId: string) {
    this.start();
    this.startLoading();

    return this.adminService.deleteEvent(eventId).pipe(
      tap(res => this.successHandler.handle(res)),
      tap(() => this.stop()),
      finalize(() => this.stopLoading()),
      this.handleError()
    );
  }
}
