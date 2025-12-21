/**
 * Constantes et types utilisés pour la configuration
 * des options liées aux événements (matériel requis et niveau de pratique).
 *
 * Ce fichier centralise les valeurs utilisées
 * dans les formulaires et filtres de l’application.
 */

export type MaterialOptionValue = 'PROVIDED' | 'YOUR_OWN' | 'NOT_REQUIRED';
export type LevelOptionValue = 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT' | 'ALL_LEVELS';

export interface MaterialOption {
  label: string;
  value: MaterialOptionValue;
}

export interface LevelOption {
  label: string;
  value: LevelOptionValue;
}

export const MATERIAL_OPTIONS: MaterialOption[] = [
  { label: 'Fournis', value: 'PROVIDED' },
  { label: 'Amener son matériel', value: 'YOUR_OWN' },
  { label: 'Pas de matériel requis', value: 'NOT_REQUIRED' }
];

export const LEVEL_OPTIONS: LevelOption[] = [
  { label: 'Débutant', value: 'BEGINNER' },
  { label: 'Intermédiaire', value: 'INTERMEDIATE' },
  { label: 'Expert', value: 'EXPERT' },
  { label: 'Tous niveaux', value: 'ALL_LEVELS' }
];
