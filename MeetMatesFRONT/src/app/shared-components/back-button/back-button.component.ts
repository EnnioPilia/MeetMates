import { Component, Input, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './back-button.component.html',
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
