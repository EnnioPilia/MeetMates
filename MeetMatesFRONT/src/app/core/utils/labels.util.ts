/**
 * Utilitaires de conversion des codes internes vers des libellés lisibles.
 *
 * Ces fonctions sont centralisées afin d’assurer une cohérence d'affichage
 * dans toute l'application (statuts, niveaux, matériel, participation, etc.).
 * 
 * Chaque fonction reçoit un code provenant du backend et retourne
 * automatiquement son équivalent lisible en français.
 */

/**
 * Retourne le libellé lisible correspondant à un statut d’atelier.
 *
 * @param status Code du statut (ex. : "OPEN", "FULL", "CANCELLED", "FINISHED")
 * @returns Libellé lisible en français ou la valeur brute si inconnue
 */
export function getStatusLabel(status: string): string {
  switch (status) {
    case 'OPEN': return 'Ouvert';
    case 'FULL': return 'Complet';
    case 'CANCELLED': return 'Annulé';
    case 'FINISHED': return 'Terminé';
    default: return status;
  }
}

/**
 * Retourne le libellé lisible correspondant à un niveau de difficulté.
 *
 * @param level Code du niveau (ex. : "BEGINNER", "INTERMEDIATE", "EXPERT", "ALL_LEVELS")
 * @returns Libellé en français ou la valeur brute si inconnue
 */
export function getLevelLabel(level: string): string {
  switch (level) {
    case 'BEGINNER': return 'Débutant';
    case 'INTERMEDIATE': return 'Intermédiaire';
    case 'EXPERT': return 'Expert';
    case 'ALL_LEVELS': return 'Tous niveaux';
    default: return level;
  }
}

/**
 * Retourne le libellé lisible correspondant au type de matériel requis.
 *
 * @param material Code du matériel (ex. : "YOUR_OWN", "PROVIDED", "NOT_REQUIRED")
 * @returns Libellé en français ou la valeur brute si inconnue
 */
export function getMaterialLabel(material: string): string {
  switch (material) {
    case 'YOUR_OWN': return 'Apporter votre matériel';
    case 'PROVIDED': return 'Matériel fourni';
    case 'NOT_REQUIRED': return 'Pas de matériel requis';
    default: return material;
  }
}

/**
 * Retourne le libellé lisible correspondant au statut de participation d’un utilisateur.
 *
 * @param status Code du statut (ex. : "ACCEPTED", "PENDING", "REJECTED")
 * @returns Libellé en français ou "Statut inconnu" si indéfini
 */
export function getParticipationLabel(status: string | null | undefined): string {
  switch (status) {
    case 'ACCEPTED': return 'Accepté';
    case 'PENDING': return 'En attente';
    case 'REJECTED': return 'Refusé';
    default: return 'Statut inconnu';
  }
}
