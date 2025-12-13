import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';

import { AuthFacade } from '../../../core/facades/auth/auth.facade';

import { AppButtonComponent } from '../../../shared-components/button/button.component';
import { AppInputComponent } from '../../../shared-components/input/input.component';

/**
 * @component LoginComponent
 * @standalone
 * @public
 *
 * @description
 * Composant UI purement déclaratif chargé de collecter les identifiants.
 * Aucune logique métier, aucune persistance, aucun traitement d’erreur.
 * L’authentification et l’état d’exécution proviennent exclusivement d’`AuthFacade`.
 *
 * @remarks UI:
 * - Change detection strictement OnPush.
 * - Le bouton de soumission est désactivé si le formulaire est invalide
 *   ou si une soumission est en cours.
 *
 * @remarks Form:
 * - `email` : requis, conforme RFC, normalisé (`trim + lowercase`).
 * - `password` : requis, min. 6 caractères.
 *
 * @remarks Invariant:
 * - `onSubmit()` n’est jamais exécuté si le formulaire est invalide.
 * - Aucun état interne mutable en dehors du formulaire.
 *
 * @security
 * - Aucune conservation locale ; données sensibles strictement en mémoire.
 *
 * @remarks Dependencies:
 * - `Router` : navigation après authentification.
 * - `AuthFacade` : orchestration de l’authentification.
 * - `NonNullableFormBuilder` : création du formulaire fortement typé.
 * - `ChangeDetectorRef` : contrôle manuel du cycle de détection.
 * - `DestroyRef` : gestion déclarative du cycle de vie Angular.
 */

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    AppButtonComponent,
    AppInputComponent,
  ],
})
export class LoginComponent {
  private router = inject(Router);
  private fb = inject(NonNullableFormBuilder);
  private authFacade = inject(AuthFacade);
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  /**
   * Formulaire réactif strictement validé.
   *
   * @remarks
   * - `email` : requis, conforme RFC.
   * - `password` : requis, minimum 6 caractères.
   */
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  /** Indique si une soumission est en cours (désactive les actions UI). 
   * @see AuthFacade.isSubmitting
   */
  get isSubmitting() {
    return this.authFacade.isSubmitting;
  }

  /**
   * Soumet le formulaire si valide et déclenche l’authentification via AuthFacade.
   *
   * @remarks
   * - Normalise l’email avant soumission (trim + lowercase).
   * - Déclenche manuellement la mise à jour de la vue (ChangeDetectionStrategy.OnPush).
   * - Ne s’exécute jamais si le formulaire est invalide.
   *
   * @throws {AuthError} Peut lever des erreurs liées à l’authentification (invalid credentials, network error)
   * @returns {void} Cette méthode ne retourne pas de valeur.
   */
  onSubmit(): void {
    if (this.form.invalid) return;

    const { email, password } = this.form.getRawValue();

    this.authFacade
      .login(email.trim().toLowerCase(), password)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((success) => {
        this.cdr.markForCheck();
      });
  }

  /**
   * Navigue vers un segment de route simple.
   * @param path - Segment de route sans slash initial.
   * @see Router
   */
  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
