
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignalsService } from '../../core/services/signals/signals.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private signals: SignalsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.signals.setPageTitle('Accueil');
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
    onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log("Utilisateur déconnecté");
        this.router.navigate(['/login']); // redirige vers la page de login
      },
      error: err => {
        console.error("Erreur lors de la déconnexion", err);
      }
    });
  }
}


// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { SharedButtonComponent } from '../../shared/components/button/shared-button.component';
// import { SharedTitleComponent } from '../../shared/components/title/shared-title.component';
// import { SharedTextComponent } from '../../shared/components/text/shared-text.component';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [
//     CommonModule,
//     SharedButtonComponent,
//     RouterModule,
//     SharedTitleComponent,
//     SharedTextComponent
//   ],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.scss']
// })
// export class HomeComponent {
//   constructor(private router: Router) {   console.log('HomeComponent chargé');
// }

//   navigateTo(path: string) {
//     this.router.navigate([`/${path}`]);
//   }
  
// }
