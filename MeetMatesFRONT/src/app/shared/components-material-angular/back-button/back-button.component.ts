import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-back-button',
  standalone: true,
  template: `
    <button mat-icon-button (click)="goBack()" aria-label="Retour">
      <mat-icon>arrow_back</mat-icon>
    </button>
  `,
  imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class BackButtonComponent {
  @Input() fallbackRoute: string = '/';

  constructor(private location: Location, private router: Router) {}

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate([this.fallbackRoute]);
    }
  }
}
