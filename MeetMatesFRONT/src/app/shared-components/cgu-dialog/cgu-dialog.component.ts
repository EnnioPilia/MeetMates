import { Component, Inject, inject } from '@angular/core';
import { LegalService } from '../../core/services/legal.service/legal.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

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