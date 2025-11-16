import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
//  Locale FR
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);
// Angular Material & Forms
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
//  Routes de l'application
import { routes } from './app.routes';
//  Intercepteurs 
// / import { authInterceptor } from './core/interceptors/auth.interceptor';  --- (décommenter)
// / import { errorInterceptor } from './core/interceptors/error.interceptor'; --- (décommenter)

export const appConfig: ApplicationConfig = {
  providers: [
    //  Optimisation Angular
    provideZoneChangeDetection({ eventCoalescing: true }),
    //  Router + transitions fluide
    provideRouter(routes, withViewTransitions()),
    // HTTP + intercepteurs
    provideHttpClient(
      // withInterceptors([authInterceptor, errorInterceptor]) --- (décommenter)
    ),
    // Animations Angular
    provideAnimations(),
    //  Locale FR globale
    { provide: LOCALE_ID, useValue: 'fr' },

    //  Material Modules / Forms
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
