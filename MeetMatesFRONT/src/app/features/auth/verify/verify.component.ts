import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-verify',
  standalone: true,
   imports: [MatCardModule],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  message = 'Activation en cours...';
  success = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.message = '❌ Token de vérification manquant.';
      return;
    }

    // Appel API pour vérifier le token
    this.http.get<{ message: string }>(`http://localhost:8080/auth/verify?token=${token}`).subscribe({
      next: (res) => {
        this.message = res?.message || '✅ Votre compte a été activé avec succès.';
        this.success = true;
      },
      error: (err) => {
        console.error('[Verify] Erreur :', err);
        this.message = err?.error?.message || '❌ Erreur lors de la vérification du compte.';
        this.success = false;
      }
    });
  }
}
