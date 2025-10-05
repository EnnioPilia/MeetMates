import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatCardModule,
  MatCardTitle,
  MatCardContent,
  MatCardActions,
} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface EventItem {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
  description: string;
  imageUrl: string;
  participants: number;
}

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent {
  loading = false;

  events: EventItem[] = [
    {
      id: 1,
      title: 'Marathon de Paris',
      date: '2025-04-13',
      location: 'Paris, France',
      category: 'Sport',
      description:
        'Une course emblématique à travers les plus beaux monuments de Paris. Relevez le défi des 42 km dans une ambiance exceptionnelle.',
      imageUrl: 'https://source.unsplash.com/featured/?marathon,paris',
      participants: 230,
    },
    {
      id: 2,
      title: 'Festival du Jazz',
      date: '2025-06-28',
      location: 'Vienne, France',
      category: 'Musique',
      description:
        'Un rendez-vous incontournable pour les amateurs de jazz et de groove sous les étoiles.',
      imageUrl: 'https://source.unsplash.com/featured/?jazz,concert',
      participants: 540,
    },
  ];
}
