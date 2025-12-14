import { CommonModule } from '@angular/common';
import { Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';

import { AuthFacade } from '../../../core/facades/auth/auth.facade';

import { NotificationService } from '../../../core/services/notification/notification.service';

import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { AppInputComponent } from '../../../shared-components/input/input.component';

/**
 * Composant de demande de réinitialisation de mot de passe.
 *
 * Rôle :
 * - gérer l’interface utilisateur du formulaire de réinitialisation
 * - effectuer la validation côté client
 * - déléguer l’ensemble de la logique métier à `AuthFacade`
 * - déclencher un feedback utilisateur via `NotificationService`
 *
 * La stratégie de détection `OnPush` est utilisée afin d’optimiser
 * les performances et limiter les cycles de détection inutiles.
 */
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    AppButtonComponent,
    AppInputComponent,
  ],
})
export class ForgotPasswordComponent {
  
  private fb = inject(NonNullableFormBuilder);
  private authFacade = inject(AuthFacade);
  private notification = inject(NotificationService);

  /** Utilisé pour déclencher manuellement la détection de changement avec OnPush. */
  private cdr = inject(ChangeDetectorRef);

  /** Référence utilisée par takeUntilDestroyed pour auto-unsubscribe proprement. */
  private destroyRef = inject(DestroyRef);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  /**
   * Expose l’état de soumission fourni par la facade
   * afin de désactiver les actions UI pendant la requête.
   */
  get isSubmitting() {
    return this.authFacade.isSubmitting;
  }

  /**
   * Soumet l’email et déclenche la demande de réinitialisation via la facade d’authentification.
   * L’email est normalisé avant l’envoi (trim + lowercase).
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.notification.showWarning('Veuillez entrer une adresse e-mail valide.');
      return;
    }

    const email = this.form.getRawValue().email.trim().toLowerCase();

    this.authFacade
      .requestPasswordReset(email)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }
}
