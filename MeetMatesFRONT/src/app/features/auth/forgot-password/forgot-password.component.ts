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
 * @component ForgotPasswordComponent
 * @standalone
 * @public
 *
 * @description
 * Composant UI déclaratif pour la demande de réinitialisation du mot de passe.
 * Récupère l’email, délègue la logique métier à `AuthFacade`, et optimise
 * les performances via la stratégie OnPush.
 *
 * @remarks UI:
 * - Validation immédiate du champ email.
 * - Bouton désactivé pendant la soumission.
 * - Feedback clair via NotificationService.
 *
 * @remarks Form:
 * - `email` : requis, conforme RFC, normalisé (`trim + lowercase`).
 *
 * @remarks Invariant:
 * - `onSubmit()` n’est jamais exécuté si le formulaire est invalide.
 *
 * @security
 * - Données sensibles strictement en mémoire.
 *
 * @remarks Dependencies:
 * - `AuthFacade` : orchestration de la demande de réinitialisation.
 * - `NotificationService` : feedback utilisateur.
 * - `NonNullableFormBuilder` : création du formulaire fortement typé.
 * - `ChangeDetectorRef` : contrôle manuel du cycle de détection.
 * - `DestroyRef` : gestion déclarative du cycle de vie Angular.
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

  /** Indique si une soumission est en cours (désactive les actions UI). */
  get isSubmitting() {
    return this.authFacade.isSubmitting;
  }
  
  /**
   * Soumet l’email et déclenche la demande de réinitialisation via AuthFacade.
   *
   * @remarks
   * - Normalise l’email (`trim + lowercase`) avant envoi.
   * - Actualise manuellement la vue après succès (`markForCheck`).
   *
   * @returns void
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
