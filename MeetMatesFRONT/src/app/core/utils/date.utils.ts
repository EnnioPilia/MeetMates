/**
 * Fonctions utilitaires pour gérer les dates locales sans décalage de fuseau horaire.
 * JavaScript interprète `YYYY-MM-DD` en UTC, ce qui crée un décalage dans `<input type="date">`.
 * Ces helpers permettent de créer et formater des dates en mode local.
 */

/**
 * Convertit `YYYY-MM-DD` en `Date` locale (sans shift UTC).
 *
 * @param dateString Chaîne au format `YYYY-MM-DD`
 * @returns Date correspondant exactement à la date locale
 */
export function parseLocalDate(dateString: string): Date {
  const [y, m, d] = dateString.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Formate une `Date` en `YYYY-MM-DD` en utilisant les valeurs locales.
 *
 * @param date Date à formater
 * @returns Chaîne `YYYY-MM-DD`
 */

export function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
