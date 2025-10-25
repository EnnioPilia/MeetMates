import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <mat-card class="flex flex-col items-center gap-2 w-full mt-8">
      <img [src]="'assets/default-avatar.png'" class="w-32 h-32 rounded-full object-cover border-2 border-black" />
      <p>{{ user?.lastName }} {{ user?.firstName }}</p>
      <p>{{ user?.email }}</p>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileCardComponent {
  @Input() user!: any;
}
