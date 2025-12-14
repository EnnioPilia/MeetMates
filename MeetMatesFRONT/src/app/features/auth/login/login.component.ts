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
 * Composant de connexion utilisateur.
 *
 * Responsabilités :
 * - affiche un formulaire de connexion (email / mot de passe)
 * - valide les données côté client via Reactive Forms
 * - délègue l’authentification à `AuthFacade`
 * - déclenche la navigation via le routeur
 *
 * Le composant ne contient aucune logique métier :
 * l’état d’exécution et les effets (authentification, loading)
 * sont entièrement gérés par la facade.
 *
 * La stratégie de détection `OnPush` est utilisée afin
 * d’optimiser les performances et limiter les cycles inutiles.
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

  /** Formulaire réactif de connexion. */
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  /**
   * Expose l’état de soumission fourni par la facade
   * afin de désactiver les actions UI pendant la requête.
   */
  get isSubmitting() {
    return this.authFacade.isSubmitting;
  }

  /**
   * Soumet le formulaire de connexion si valide.
   *
   * - Normalise l’email avant l’envoi (trim + lowercase)
   * - Délègue l’authentification à `AuthFacade`
   * - Déclenche manuellement la détection de changement
   *   en raison de la stratégie `OnPush`
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
   * Redirige l’utilisateur vers une route donnée.
   * 
   * @param path Segment de route (sans slash initial)
   */
  navigateTo(path: string): void {
    this.router.navigate([`/${path}`]);
  }
}
