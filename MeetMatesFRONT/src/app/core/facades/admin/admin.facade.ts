// Angular
import { Injectable, inject, signal } from '@angular/core';
import { tap, finalize } from 'rxjs';

// Core (facades, services, models)
import { BaseFacade } from '../base/base.facade';
import { AdminService } from '../../services/admin/admin.service';
import { SuccessHandlerService } from '../../services/success-handler/success-handler.service';
import { User } from '../../models/user.model';
import { EventResponse } from '../../models/event-response.model';

/**
 * Facade responsable des cas d’usage d’administration.
 *
 * Cette facade orchestre l’ensemble des opérations
 * liées à la gestion administrative des utilisateurs
 * et des événements.
 *
 * Responsabilités :
 * - délégation des appels API au `AdminService`
 * - orchestration des cas d’usage administrateur
 * - gestion et exposition de l’état via signals
 * - synchronisation de l’état local après actions (soft / hard delete, restore)
 * - centralisation des effets transverses (loading, erreurs, succès)
 *   via `BaseFacade` et `SuccessHandlerService`
 */
@Injectable({ providedIn: 'root' })
export class AdminFacade extends BaseFacade {

  private adminService = inject(AdminService);
  private successHandler = inject(SuccessHandlerService);

  readonly users = signal<User[]>([]);
  readonly events = signal<EventResponse[]>([]);

  /** État de soumission */
  isSubmitting = false;
  private startSubmit() { this.isSubmitting = true; }
  private stopSubmit() { this.isSubmitting = false; }


  /** Charge la liste complète des utilisateurs. */
  loadUsers() {
    this.startLoading();

    return this.adminService.getAllUsers().pipe(
      tap(res => this.users.set(res.data)),
      finalize(() => this.stopLoading()),
      this.handleError()
    );
  }

  /**
   * Supprime un utilisateur de manière logique (soft delete).
   *
   * @param userId Identifiant de l’utilisateur
   */
  softDeleteUser(userId: string) {
    this.startSubmit();
    this.startLoading();

    return this.adminService.softDeleteUser(userId).pipe(
      tap(res => this.successHandler.handle(res)),
      tap(() => {
        this.users.update(users =>
          users.map(user =>
            user.id === userId
              ? {
                ...user,
                deletedAt: new Date().toISOString(),
                status: 'BANNED'
              }
              : user
          )
        );
      }),

      finalize(() => {
        this.stopSubmit();
        this.stopLoading();
      }),
      this.handleError()
    );
  }

  /**
   * Supprime définitivement un utilisateur (hard delete).
   *
   * @param userId Identifiant de l’utilisateur
   */
  hardDeleteUser(userId: string) {
    this.startSubmit();
    this.startLoading();

    return this.adminService.hardDeleteUser(userId).pipe(
      tap(res => this.successHandler.handle(res)),
      tap(() => this.users.update(u => u.filter(user => user.id !== userId))),
      finalize(() => {
        this.stopSubmit();
        this.stopLoading();
      }),
      this.handleError()
    );
  }

  /**
   * Restaure un utilisateur précédemment supprimé.
   *
   * @param userId Identifiant de l’utilisateur
   */
  restoreUser(userId: string) {
    this.startSubmit();
    this.startLoading();

    return this.adminService.restoreUser(userId).pipe(
      tap(res => this.successHandler.handle(res)),
      tap(() => {
        this.users.update(users =>
          users.map(user =>
            user.id === userId
              ? {
                ...user,
                deletedAt: null,
                status: 'ACTIVE'
              }
              : user
          )
        );
      }),
      finalize(() => {
        this.stopSubmit();
        this.stopLoading();
      }),
      this.handleError()
    );
  }

  /** Charge la liste complète des événements. */
  loadEvents() {
    this.startLoading();

    return this.adminService.getAllEvents().pipe(
      tap(res => this.events.set(res.data)),
      finalize(() => this.stopLoading()),
      this.handleError()
    );
  }

  /**
   * Supprime un événement de manière logique (soft delete).
   *
   * @param eventId Identifiant de l’événement
   */
  softDeleteEvent(eventId: string) {
    this.startSubmit();
    this.startLoading();

    return this.adminService.softDeleteEvent(eventId).pipe(
      tap(res => this.successHandler.handle(res)),
      tap(() => {
        this.events.update(events =>
          events.map(ev =>
            ev.id === eventId
              ? { ...ev, deletedAt: new Date().toISOString() }
              : ev
          )
        );
      }),
      finalize(() => {
        this.stopSubmit();
        this.stopLoading();
      }),
      this.handleError()
    );
  }

  /**
   * Supprime définitivement un événement (hard delete).
   *
   * @param eventId Identifiant de l’événement
   */
  hardDeleteEvent(eventId: string) {
    this.startSubmit();
    this.startLoading();

    return this.adminService.hardDeleteEvent(eventId).pipe(
      tap(res => this.successHandler.handle(res)),
      tap(() => this.events.update(e => e.filter(ev => ev.id !== eventId))),
      finalize(() => {
        this.stopSubmit();
        this.stopLoading();
      }),
      this.handleError()
    );
  }

  /**
   * Restaure un événement précédemment supprimé.
   *
   * @param eventId Identifiant de l’événement
   */
  restoreEvent(eventId: string) {
    this.startSubmit();
    this.startLoading();

    return this.adminService.restoreEvent(eventId).pipe(
      tap(res => this.successHandler.handle(res)),
      tap(() => {
        this.events.update(events =>
          events.map(ev =>
            ev.id === eventId
              ? { ...ev, deletedAt: null }
              : ev
          )
        );
      }),
      finalize(() => {
        this.stopSubmit();
        this.stopLoading();
      }),
      this.handleError()
    );
  }
}
