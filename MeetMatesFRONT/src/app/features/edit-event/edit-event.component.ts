import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { EditEventFacade } from '../../core/facades/events/edit-event/edit-event.facade';
import { EventFormMapper } from '../../core/mappers/event-form.mapper';
import { EventFormValue } from '../../core/models/event-form.model';
import { StateHandlerComponent } from '../../shared-components/state-handler/state-handler.component';
import { EventFormComponent } from '../event-form/event-form.component';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    EventFormComponent, 
    StateHandlerComponent
  ],
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventPage implements OnInit {

  private facade = inject(EditEventFacade);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  event = this.facade.event;
  activities = this.facade.activities;
  addressSuggestions = this.facade.addressSuggestions;
  loading = this.facade.loading;
  error = this.facade.error;

  formData = computed<Partial<EventFormValue> | null>(() => {
    const e = this.event();
    return e ? EventFormMapper.toFormValue(e) : null;
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.facade.loadEvent(id).subscribe();
  }

  update(value: EventFormValue) {
    const current = this.event();
    if (!current) return;

    const request = EventFormMapper.toUpdateRequest(value, current.status);

    this.facade.updateEvent(current.id, request).subscribe({
      next: () => {
        this.router.navigate(['/profile']);
      }
    });
  }

  searchAddress(query: string) {
    this.facade.getAddressSuggestions(query).subscribe();
  }
}
