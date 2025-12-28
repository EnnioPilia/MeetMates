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
 * - signals
 * - loading centralisé
 * - aucune souscription interne
 * - séparation soft / hard delete
 */
@Injectable({ providedIn: 'root' })
export class AdminFacade extends BaseFacade {

  private adminService = inject(AdminService);
  private successHandler = inject(SuccessHandlerService);

  /** Listes */
  readonly users = signal<User[]>([]);
  readonly events = signal<EventResponse[]>([]);

  /** État de soumission */
  isSubmitting = false;
  private startSubmit() { this.isSubmitting = true; }
  private stopSubmit() { this.isSubmitting = false; }

  /* ================= USERS ================= */

  loadUsers() {
    this.startLoading();

    return this.adminService.getAllUsers().pipe(
      tap(res => this.users.set(res.data)),
      finalize(() => this.stopLoading()),
      this.handleError()
    );
  }

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

  /* ================= EVENTS ================= */

  loadEvents() {
    this.startLoading();

    return this.adminService.getAllEvents().pipe(
      tap(res => this.events.set(res.data)),
      finalize(() => this.stopLoading()),
      this.handleError()
    );
  }

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
