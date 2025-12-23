// Angular
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Angular Material
import { MatCardModule } from '@angular/material/card';

// Core (facades, services)
import { AuthFacade } from '../../../core/facades/auth/auth.facade';
import { NotificationService } from '../../../core/services/notification/notification.service';

// Shared components
import { AppInputComponent } from '../../../shared-components/input/input.component';
import { AppButtonComponent } from '../../../shared-components/button/button.component';

/**
 * Composant de réinitialisation du mot de passe.
 *
 * Responsabilités :
 * - récupérer le token de réinitialisation depuis l’URL
 * - afficher et valider le formulaire de nouveau mot de passe
 * - déléguer la logique métier à `AuthFacade`
 * - fournir un retour utilisateur via `NotificationService`
 *
 * La stratégie de détection `OnPush` est utilisée afin
 * d’optimiser les performances et limiter les cycles inutiles.
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

  /** Token de réinitialisation extrait des paramètres d’URL. */
  token: string | null = null;

  /** Formulaire strict de réinitialisation du mot de passe. */
  form = this.fb.nonNullable.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  /**
   * Récupère le token de réinitialisation depuis les query params.
   * Le token est requis pour autoriser la modification du mot de passe.
   */
  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  /**
   * Expose l’état de soumission fourni par la facade
   * afin de désactiver les actions UI pendant la requête.
   */
  get isSubmitting() {
    return this.authFacade.isSubmitting;
  }

  /**
   * Soumet le formulaire de réinitialisation si valide.
   *
   * - Vérifie la validité du formulaire
   * - Valide la correspondance des mots de passe
   * - Vérifie la présence du token de réinitialisation
   * - Délègue la mise à jour du mot de passe à `AuthFacade`
   * - Déclenche manuellement la détection de changement
   *   en raison de la stratégie `OnPush`
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
