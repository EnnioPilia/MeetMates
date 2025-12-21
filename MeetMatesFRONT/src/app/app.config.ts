// Angular
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Routes
import { routes } from './app.routes';

/**
 * Configuration globale de l’application Angular.
 *
 * Ce fichier centralise l’enregistrement des providers principaux :
 * - routing applicatif (avec View Transitions)
 * - client HTTP et interceptors
 * - animations Angular Material
 * - modules Angular Material partagés
 * - gestion des zones et optimisation des cycles de détection
 * - configuration de la localisation (français)
 *
 * Cette configuration est utilisée au bootstrap de l’application
 * via `bootstrapApplication`.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    /**
     * Optimisation de la détection de changements Angular
     * en regroupant les événements asynchrones.
     */
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    /**
     * Configuration du router applicatif avec
     * prise en charge des View Transitions (animations natives).
     */
    provideRouter(routes, withViewTransitions()),

    /** Fournit le client HTTP avec la possibilité d’enregistrer des interceptors globaux. */
    provideHttpClient(),

    /** Active les animations Angular (nécessaires à Angular Material). */
    provideAnimations(),

    /** Configuration globale de la locale de l’application. Utilisée pour les dates, nombres et pipes Angular. */
    { provide: LOCALE_ID, useValue: 'fr' },

    /** Import centralisé des modules Angular Material et Angular Forms utilisés globalement. */
    importProvidersFrom(
      MatButtonModule,
      MatCardModule,
      MatInputModule,
      MatToolbarModule,
      MatIconModule,
      FormsModule,
      MatFormFieldModule,
      MatSnackBarModule
    ),
  ]
};