import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LegalService {
  getCguContent(): string {
    return `
      <h3 class="mb-2">Conditions Générales d’Utilisation</h3>
      <p><strong>Dernière mise à jour :</strong>"date"</p>
      <p>
        Les présentes conditions définissent les modalités d’utilisation
        de nos services. En créant un compte, vous acceptez pleinement
        ces conditions.<br>
        Nous pouvons les modifier à tout moment, vous en serez informé
        via nos canaux officiels.
      </p>
    `;
  }

  getMentionsLegales(): string {
    return `
      <h3 class="mb-2">Mentions légales</h3>
      <p><strong>Entreprise :</strong> Exemple SAS</p>
      <p><strong>Adresse :</strong> 123 Rue de Paris, 75000 Paris</p>
      <p><strong>Contact :</strong> contact@exemple.com</p>
      <p><strong>Hébergeur :</strong> OVH – 2 rue Kellermann, 59100 Roubaix</p>
    `;
  }
}
