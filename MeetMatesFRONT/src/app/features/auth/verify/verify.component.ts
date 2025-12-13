import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatCardModule } from '@angular/material/card';

import { AuthFacade } from '../../../core/facades/auth/auth.facade';

/**
 * @component VerifyComponent
 * @standalone
 * @public
 *
 * @description
 * Composant UI déclaratif chargé de valider l’email utilisateur à partir d’un token.
 * Récupère le token depuis l’URL, délègue la vérification à `AuthFacade`,
 * et met à jour l’interface utilisateur selon le résultat.
 *
 * @remarks UI:
 * - Affiche un message explicite pendant le traitement.
 * - Retour utilisateur immédiat en cas de succès ou d’échec.
 *
 * @remarks Invariant:
 * - Le composant ne fait aucune mutation d’état autre que `message` et `success`.
 *
 * @security
 * - Aucune donnée sensible persistée côté client.
 *
 * @remarks Dependencies:
 * - `ActivatedRoute` : récupération du token.
 * - `AuthFacade` : vérification de l’activation de l’email.
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
    * Extrait le token depuis l’URL et déclenche la vérification via `AuthFacade`.
    *
    * @remarks
    * - Vérifie la présence du token.
    * - Appelle `AuthFacade.verifyEmail`.
    * - Met à jour l’état d’affichage selon le résultat.
    *
    * @returns void
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
