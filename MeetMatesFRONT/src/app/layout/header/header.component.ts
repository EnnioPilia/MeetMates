import { Component, inject } from '@angular/core';
import { SignalsService } from '../../core/services/signals/signals.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BackButtonComponent } from '../../shared-components/back-button/back-button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbarModule, 
    MatIconModule, 
    MatButtonModule, 
    MatDialogModule,
    BackButtonComponent]
    ,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  signals = inject(SignalsService);
}
