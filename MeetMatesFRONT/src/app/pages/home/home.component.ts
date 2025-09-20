import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedButtonComponent } from '../../shared/components/shared-button/shared-button.component';
import { SharedTitleComponent } from '../../shared/components/shared-title/shared-title.component';
import { SharedTextComponent } from '../../shared/components/shared-text/shared-text.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SharedButtonComponent,
    RouterModule,
    SharedTitleComponent,
    SharedTextComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private router: Router) {   console.log('HomeComponent chargé');
}

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
  
}
