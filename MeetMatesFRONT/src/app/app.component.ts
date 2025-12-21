// Angular 
import { Component, inject, DestroyRef } from '@angular/core';
import { RouterOutlet, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Layout 
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';

// Core (services)
import { SignalsService } from './core/services/signals/signals.service';


/**
 * Composant racine de l’application.
 *
 * Responsabilités :
 * - héberger le layout global (header, footer, router-outlet)
 * - écouter les changements de navigation
 * - synchroniser le titre de page à partir des données de route
 *   via le `SignalsService`
 *
 * Ce composant centralise la logique globale liée au routage.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    HeaderComponent, 
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private signals = inject(SignalsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.updatePageTitle());
  }

  /**
   * Met à jour le titre de la page courante
   * en fonction des données de la route active.
   */
  private updatePageTitle() {
    let currentRoute = this.route.root;
    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    const title = currentRoute.snapshot.data['title'] ?? 'MeetMates';
    this.signals.setPageTitle(title);
  }
}
