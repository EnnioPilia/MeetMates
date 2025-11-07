import { Component, OnInit, inject  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  message = 'Activation en cours...';
  success = false;

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.message = '❌ Token de vérification manquant.';
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: (res) => {
        this.message = res.message || '✅ Votre compte a été activé avec succès.';
        this.success = true;
      },
      error: (err) => {
        this.message = err.message || '❌ Erreur lors de la vérification du compte.';
        this.success = false;
      }
    });
  }
}