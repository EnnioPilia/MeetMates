import { Component, Inject, Input, inject } from '@angular/core';
import { Location, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-back-button',
  standalone: true,
  templateUrl: './back-button.component.html',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
})
export class BackButtonComponent {
  private location = inject(Location);
  private router = inject(Router);

  @Input() fallbackRoute: string = '/';

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate([this.fallbackRoute]);
    }
  }
}
