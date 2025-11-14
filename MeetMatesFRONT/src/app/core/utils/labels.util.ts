export function getStatusLabel(status: string): string {
  switch (status) {
    case 'OPEN': return 'Ouvert';
    case 'FULL': return 'Complet';
    case 'CANCELLED': return 'Annulé';
    case 'FINISHED': return 'Terminé';
    default: return status;
  }
}

export function getLevelLabel(level: string): string {
  switch (level) {
    case 'BEGINNER': return 'Débutant';
    case 'INTERMEDIATE': return 'Intermédiaire';
    case 'EXPERT': return 'Expert';
    case 'ALL_LEVELS': return 'Tous niveaux';
    default: return level;
  }
}

export function getMaterialLabel(material: string): string {
  switch (material) {
    case 'YOUR_OWN': return 'Apporter votre matériel';
    case 'PROVIDED': return 'Matériel fourni';
    case 'NOT_REQUIRED': return 'Pas de matériel requis';
    default: return material;
  }
}

export function getParticipationLabel(status: string | null | undefined): string {
  switch (status) {
    case 'ACCEPTED': return 'Accepté';
    case 'PENDING': return 'En attente';
    case 'REJECTED': return 'Refusé';
    default: return 'Statut inconnu';
  }
}
