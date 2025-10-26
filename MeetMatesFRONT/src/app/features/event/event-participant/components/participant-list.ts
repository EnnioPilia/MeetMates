import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-participant-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col w-full mt-4">
      <p class="font-semibold text-lg mb-2 border-b border-black">
        LISTE DES PARTICIPANTS :
      </p>

      @if (participants.length) {
        <ul class="list-disc pl-6 flex flex-col gap-1">
          @for (p of participants; track p.id) {
            <li>{{ p.firstName }} {{ p.lastName }}</li>
          }
        </ul>
      } @else {
        <p class="text-gray-500">Aucun participant accepté pour le moment.</p>
      }
    </div>
  `
})
export class ParticipantListComponent {
  @Input() participants: { id: string; firstName: string; lastName: string }[] = [];
}
