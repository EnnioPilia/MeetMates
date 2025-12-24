import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SignalsService } from '../services/signals/signals.service';

/**
 * Guard UX uniquement (pas sécurité)
 * La sécurité reste côté backend
 */
@Injectable({ providedIn: 'root' })
export class AdminGuard {

  private signals = inject(SignalsService);
  private router = inject(Router);

  canActivate(): boolean {
    if (!this.signals.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (!this.signals.isAdmin()) {
      this.router.navigate(['/forbidden']);
      return false;
    }

    return true;
  }
}
