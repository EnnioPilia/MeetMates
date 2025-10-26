import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-picture-uploader',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './picture-uploader.html',
})
export class PictureUploaderComponent {
  @Input() previewUrl?: string | null;
  @Input() label: string = 'Photo';
  @Output() fileSelected = new EventEmitter<File>();
  @Output() remove = new EventEmitter<void>();
  @Input() width: number = 300;
  @Input() height: number = 130;

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.fileSelected.emit(input.files[0]);
    }
  }
}