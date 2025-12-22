// Angular
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Core (facades, services)
import { AuthFacade } from '../../../core/facades/auth/auth.facade';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { DialogService } from '../../../core/services/dialog.service/dialog.service';

// Shared components
import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { AppInputComponent } from '../../../shared-components/input/input.component';

/**
 * Composant d’inscription utilisateur.
 *
 * Responsabilités :
 * - affiche le formulaire de création de compte
 * - valide les données côté client (Reactive Forms)
 * - délègue la création de compte à `AuthFacade`
 * - gère l’acceptation des Conditions Générales d’Utilisation
 *
 * Le composant ne contient aucune logique métier :
 * l’inscription, les états de chargement et les effets
 * sont entièrement orchestrés par la facade d’authentification.
 *
 * La stratégie de détection `OnPush` est utilisée afin
 * d’optimiser les performances et limiter les cycles inutiles.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatCheckboxModule,
    AppButtonComponent,
    AppInputComponent,
  ],
})
export class RegisterComponent {
  
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);
  private authFacade = inject(AuthFacade);
  private notification = inject(NotificationService);
  private dialogService = inject(DialogService);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  /** Formulaire réactif strict de création de compte. */
  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    acceptCgu: [false, Validators.requiredTrue],
  });

  /**
   * Expose l’état de soumission fourni par la facade
   * afin de désactiver les actions UI pendant la requête.
   */
  get isSubmitting() {
    return this.authFacade.isSubmitting;
  }

  /**
   * Soumet le formulaire d’inscription si valide.
   *
   * - Vérifie la correspondance des mots de passe
   * - Normalise l’email avant l’envoi (trim + lowercase)
   * - Délègue la création du compte à `AuthFacade`
   * - Déclenche manuellement la détection de changement
   *   en raison de la stratégie `OnPush`
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.notification.showWarning('Veuillez remplir tous les champs correctement.');
      return;
    }

    const { password, confirmPassword } = this.form.getRawValue();

    if (password !== confirmPassword) {
      this.notification.showError('Les mots de passe ne correspondent pas.');
      return;
    }

    const payload = {
      firstName: this.form.getRawValue().firstName,
      lastName: this.form.getRawValue().lastName,
      email: this.form.getRawValue().email.trim().toLowerCase(),
      password,
      dateAcceptationCGU: new Date().toISOString(),
    };

    this.authFacade
      .register(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.cdr.markForCheck();
      });
  }

  /**
   * Ouvre le dialogue affichant les Conditions Générales d’Utilisation.
   * Empêche le comportement par défaut du lien.
   * 
   * @param event Événement DOM déclencheur
   */
  openCguDialog(event: Event): void {
    event.preventDefault();
    this.dialogService.openCgu();
  }

  /**
   * Redirige vers une autre vue du module d’authentification.
   * 
   * @param path Segment de route (sans slash initial)
   */
  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
