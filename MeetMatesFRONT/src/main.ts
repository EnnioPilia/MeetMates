import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Point d’entrée de l’application Angular.
 *
 * Ce fichier :
 * - démarre l’application avec bootstrapApplication
 * - applique la configuration globale (providers, router, http, animations…)
 * - instancie le composant racine AppComponent
 */
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
