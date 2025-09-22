import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SignalsService } from '../../core/services/signals/signals.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private signals: SignalsService
  ) {}

  ngOnInit() {
    this.signals.setPageTitle('Accueil');
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }
}
