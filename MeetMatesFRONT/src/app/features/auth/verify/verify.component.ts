import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AuthFacade } from '../../../core/facades/auth/auth.facade';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './verify.component.html',
})
export class VerifyComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authFacade = inject(AuthFacade);

  message = 'Activation en cours...';
  success = false;

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.message = '❌ Token de vérification manquant.';
      this.success = false;
      return;
    }

    this.authFacade.verifyEmail(token).subscribe(success => {
      this.success = success;
      this.message = success
        ? 'Votre compte a été activé avec succès.'
        : 'Erreur lors de la vérification du compte.';
    });
  }
}
