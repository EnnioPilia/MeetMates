import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef,  inject} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AuthFacade } from '../../../core/facades/auth/auth.facade';

import { NotificationService } from '../../../core/services/notification/notification.service';
import { DialogService } from '../../../core/services/dialog.service/dialog.service';

import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { AppInputComponent } from '../../../shared-components/input/input.component';

/**
 * @component RegisterComponent
 * @standalone
 * @public
 *
 * @description
 * Composant UI déclaratif pour la création d’un compte utilisateur.
 * Aucune logique métier complexe ; toutes les actions (validation, création de compte)
 * sont orchestrées via `AuthFacade`.
 *
 * @remarks UI:
 * - Change detection strictement OnPush.
 * - Bouton de soumission désactivé si le formulaire est invalide
 *   ou si une soumission est en cours.
 *
 * @remarks Form:
 * - `firstName` et `lastName` : requis.
 * - `email` : requis, conforme RFC, normalisé (`trim + lowercase`).
 * - `password` : requis, min. 6 caractères.
 * - `confirmPassword` : doit correspondre au mot de passe.
 * - `acceptCgu` : doit être true.
 *
 * @remarks Invariant:
 * - `onSubmit()` n’est jamais exécuté si le formulaire est invalide.
 * - Aucun état interne mutable en dehors du formulaire.
 *
 * @security
 * - Données sensibles strictement en mémoire.
 * - Vérification obligatoire des CGU avant soumission.
 *
 * @remarks Dependencies:
 * - `Router` : navigation après inscription.
 * - `AuthFacade` : orchestration de l’inscription.
 * - `NotificationService` : affichage d’alertes.
 * - `DialogService` : affichage des CGU.
 * - `NonNullableFormBuilder` : création de formulaire fortement typé.
 * - `ChangeDetectorRef` : contrôle manuel du cycle de détection.
 * - `DestroyRef` : gestion déclarative du cycle de vie Angular.
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

  /** Formulaire strict de création de compte. */
  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    acceptCgu: [false, Validators.requiredTrue],
  });

  /** Indique si une action d'inscription est en cours (désactive les interactions UI). */
  get isSubmitting() {
    return this.authFacade.isSubmitting;
  }

  /**
   * Soumet les données d’inscription si le formulaire est valide.
   *
   * @remarks
   * - Vérifie la correspondance des mots de passe.
   * - Normalise l’email (trim + lowercase).
   * - Transmet les données à `AuthFacade.register`.
   * - Met à jour manuellement la vue (`markForCheck`).
   * 
   * @returns void
   */
  onSubmit(): void {
    if (this.form.invalid) {
      this.notification.showWarning('Veuillez remplir tous les champs correctement.');
      return;
    }

    const { password, confirmPassword } = this.form.getRawValue();

    if (password !== confirmPassword) {
      this.notification.showError('❌ Les mots de passe ne correspondent pas.');
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
   * Ouvre le dialogue affichant les Conditions Générales d'Utilisation.
   * @param event Empêche la navigation par défaut des liens.
   */
  openCguDialog(event: Event): void {
    event.preventDefault();
    this.dialogService.openCgu();
  }
    
  /**
   * Redirige vers une autre vue du module Auth. (login, etc.)
   * @param path Segment de route
   */
  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
