// Angular
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Angular Material
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';

// Core (services)
import { LegalService } from '../../core/services/legal.service/legal.service';

/**
 * Boîte de dialogue affichant les contenus légaux de l’application.
 *
 * Responsabilités :
 * - afficher les CGU ou les mentions légales selon le contexte
 * - sécuriser le contenu HTML via le `DomSanitizer`
 *
 * Le type de contenu affiché est déterminé
 * via les données injectées dans la dialog.
 */
@Component({
  selector: 'app-cgu-dialog',
  standalone: true,
  templateUrl: './cgu-dialog.component.html',
    imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule
  ],
})
export class CguDialogComponent {
  safeContent!: SafeHtml;

  private sanitizer = inject(DomSanitizer);
  private legalService = inject(LegalService);
  private data = inject<{ type: 'cgu' | 'mentions' }>(MAT_DIALOG_DATA);

  constructor() {
    const html =
      this.data?.type === 'mentions'
        ? this.legalService.getMentionsLegales()
        : this.legalService.getCguContent();

    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(html);
  }
}