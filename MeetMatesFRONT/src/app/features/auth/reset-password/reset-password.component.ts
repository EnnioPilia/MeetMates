import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';

import { AuthFacade } from '../../../core/facades/auth/auth.facade';

import { NotificationService } from '../../../core/services/notification/notification.service';

import { AppInputComponent } from '../../../shared-components/input/input.component';
import { AppButtonComponent } from '../../../shared-components/button/button.component';

/**
 * @component ResetPasswordComponent
 * @standalone
 * @public
 *
 * @description
 * Composant UI déclaratif pour la réinitialisation du mot de passe.
 * Récupère le token depuis l’URL, valide les champs et délègue la mise à jour
 * à `AuthFacade`.
 *
 * @remarks UI:
 * - Change detection strictement OnPush.
 * - Bouton de soumission désactivé pendant la soumission.
 *
 * @remarks Form:
 * - `newPassword` : requis, minimum 6 caractères.
 * - `confirmPassword` : doit correspondre au mot de passe.
 *
 * @remarks Invariant:
 * - `onSubmit()` n’est jamais exécuté si le formulaire est invalide.
 *
 * @security
 * - Données sensibles strictement en mémoire.
 *
 * @remarks Dependencies:
 * - `ActivatedRoute` : récupération du token.
 * - `AuthFacade` : orchestration de la réinitialisation.
 * - `NotificationService` : feedback utilisateur.
 * - `FormBuilder` : création du formulaire fortement typé.
 * - `ChangeDetectorRef` : contrôle manuel du cycle de détection.
 * - `DestroyRef` : gestion déclarative du cycle de vie Angular.
 */
@Component({
  selector: 'app-reset-password',
  standalone: true,
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    AppInputComponent,
    AppButtonComponent,
  ],
})
export class ResetPasswordComponent {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private authFacade = inject(AuthFacade);
  private notification = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  /** Jeton de réinitialisation extrait des query params. */
  token: string | null = null;

  /** Formulaire strict de réinitialisation du mot de passe. */
  form = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  /**
   * Récupère le token depuis l’URL.
   * @returns void
   */
  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  /** Indique si une réinitialisation est en cours (désactive les actions UI). */
  get isSubmitting() {
    return this.authFacade.isSubmitting;
  }

  /**
    * Soumet le formulaire et déclenche la réinitialisation du mot de passe.
    *
    * @remarks
    * - Vérifie la validité du formulaire.
    * - Valide la correspondance des mots de passe.
    * - Vérifie la présence du token.
    * - Transmet les données à `AuthFacade.resetPassword`.
    * - Actualise la vue manuellement (`markForCheck`).
    *
    * @returns void
    */
  onSubmit(): void {
    if (this.form.invalid) {
      this.notification.showWarning('Veuillez remplir correctement tous les champs.');
      return;
    }

    const { newPassword, confirmPassword } = this.form.getRawValue();

    if (newPassword !== confirmPassword) {
      this.notification.showError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (!this.token) {
      this.notification.showError('❌ Lien de réinitialisation invalide ou expiré.');
      return;
    }

    this.authFacade
      .resetPassword(this.token, newPassword)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }
}
