// Angular
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';

// Core (facades)
import { AuthFacade } from '../../../core/facades/auth/auth.facade';

/**
 * Composant de validation de l’adresse email utilisateur.
 *
 * Responsabilités :
 * - extraire le token de validation depuis l’URL
 * - déclencher la vérification du compte via `AuthFacade`
 * - afficher un message clair selon l’état et le résultat de l’opération
 *
 */
@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './verify.component.html',
})
export class VerifyComponent implements OnInit {
  
  private route = inject(ActivatedRoute);
  private authFacade = inject(AuthFacade);

  /** Message affiché à l'utilisateur selon l'état du traitement. */
  message = 'Activation en cours...';

  /** Indique si la vérification a réussi. */
  success = false;

  /**
   * Initialise le processus de vérification du compte.
   *
   * - Récupère le token de validation depuis les paramètres d’URL
   * - Vérifie la présence du token avant toute action
   * - Délègue la validation à `AuthFacade.verifyEmail`
   * - Met à jour l’état d’affichage selon le résultat
   */
  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.message = '❌ Token de vérification manquant.';
      this.success = false;
      return;
    }

    this.authFacade.verifyEmail(token).subscribe(success => {
      this.success = success;
      this.message = success
        ? 'Votre compte a été activé avec succès.'
        : 'Erreur lors de la vérification du compte.';
    });
  }
}
