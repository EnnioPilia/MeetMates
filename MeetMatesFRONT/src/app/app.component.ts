import { Component,OnInit  } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './layout/footer/footer.component'; // 🔹 Chemin à adapter selon ton projet
import { HeaderComponent } from './layout/header/header.component'; // 🔹 Chemin à adapter selon ton projet

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,FooterComponent,HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent  {
  title = 'AdminFindersKeepers'
}