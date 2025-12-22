import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// Feature
import { EventFormComponent } from '../event-form/event-form.component';
import { EventFormValue } from '../../core/models/event-form.model';

// Core
import { EventFacade } from '../../core/facades/events/event/event.facade';
import { EventFormMapper } from '../../core/mappers/event-form.mapper';
import { StateHandlerComponent } from '../../shared-components/state-handler/state-handler.component';
import { AddressSuggestion } from '../../core/services/address/address.service';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    EventFormComponent,
    StateHandlerComponent
  ],
  templateUrl: './post-event.component.html',
  styleUrls: ['./post-event.component.scss']
})
export class PostEventPage {

  private eventFacade = inject(EventFacade);

  activities = this.eventFacade.activities;
  addressSuggestions = this.eventFacade.addressSuggestions; 
  loading = this.eventFacade.loading;
  error = this.eventFacade.error;

  ngOnInit() {
    this.eventFacade.loadActivities().subscribe();
  }

  searchAddress(query: string) {
    this.eventFacade.searchAddress(query).subscribe();
  }

  selectAddress(address: AddressSuggestion) {}

  create(value: EventFormValue) {
    const request = EventFormMapper.toCreateRequest(value);
    this.eventFacade.createEvent(request).subscribe();
  }
}
