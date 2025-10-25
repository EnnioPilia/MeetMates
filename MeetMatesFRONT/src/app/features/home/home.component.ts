import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AppButtonComponent } from '../../../app/shared-components/button/button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatCardModule, AppButtonComponent],
})
export class HomeComponent {
  private router = inject(Router);

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
