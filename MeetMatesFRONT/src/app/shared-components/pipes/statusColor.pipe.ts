// Angular
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe de mapping de statut vers une classe CSS de couleur.
 *
 * Responsabilités :
 * - associer les statuts d’activité et de participation
 *   à une couleur cohérente dans l’UI
 *
 * Utilisé dans les composants d’événements et de profil.
 */
@Pipe({
  name: 'statusColor',
  standalone: true
})
export class StatusColorPipe implements PipeTransform {
  transform(label?: string | null): string {
    const value = label?.toLowerCase();

    switch (value) {
      // Statuts d'activité
        case 'ouvert': return 'text-green-600';
        case 'complet': return 'text-orange-500';
        case 'annulé': return 'text-red-600';
        case 'terminé': return 'text-gray-500';

      // Statuts de participation 
        case 'accepté':  return 'text-green-600';
        case 'en attente': return 'text-orange-500';
        case 'refusé': return 'text-red-600';

      default:
        return 'text-black';
    }
  }
}
