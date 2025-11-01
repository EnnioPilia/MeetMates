
export const MATERIAL_OPTIONS = [
  { label: 'Fournis', value: 'PROVIDED' },
  { label: 'Amener son matériel', value: 'YOUR_OWN' },
  { label: 'Pas de matériel requis', value: 'NOT_REQUIRED' }
];

export const LEVEL_OPTIONS = [
  { label: 'Débutant', value: 'BEGINNER' },
  { label: 'Intermédiaire', value: 'INTERMEDIATE' },
  { label: 'Expert', value: 'EXPERT' },
  { label: 'Tous niveaux', value: 'ALL_LEVELS' }
];

export type MaterialOptionValue = 'PROVIDED' | 'YOUR_OWN' | 'NOT_REQUIRED';
export type LevelOptionValue = 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT' | 'ALL_LEVELS';
