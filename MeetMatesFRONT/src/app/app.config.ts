import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// Import pour la localisation FR
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

// Material modules
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

// Tes routes
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      // Tu pourras réactiver tes intercepteurs ici
      // withInterceptors([authInterceptor, errorInterceptor])
    ),
    provideAnimations(),

    // 🟦 Locale française globale
    { provide: LOCALE_ID, useValue: 'fr' },

    // 🟪 Import des modules Material et Angular Forms
    importProvidersFrom(
      MatButtonModule,
      MatCardModule,
      MatInputModule,
      MatToolbarModule,
      MatIconModule,
      FormsModule,
      MatFormFieldModule,
      MatSnackBarModule
    )
  ]
};
