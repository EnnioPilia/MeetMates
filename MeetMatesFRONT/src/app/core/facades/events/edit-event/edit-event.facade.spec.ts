import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { EditEventFacade } from './edit-event.facade';

import { EventService } from '../../../services/event/event.service';
import { ActivityService } from '../../../services/activity/activity.service';
import { AddressService } from '../../../services/address/address.service';
import { SuccessHandlerService } from '../../../services/success-handler/success-handler.service';

import { Activity } from '../../../models/activity.model';
import { EventDetails } from '../../../models/event-details.model';
import { EventRequest } from '../../../models/event-request.model';
import { AddressSuggestion } from '../../../services/address/address.service';

describe('EditEventFacade', () => {
  let facade: EditEventFacade;

  let eventService: jasmine.SpyObj<EventService>;
  let activityService: jasmine.SpyObj<ActivityService>;
  let addressService: jasmine.SpyObj<AddressService>;
  let successHandler: jasmine.SpyObj<SuccessHandlerService>;

  const mockActivities: Activity[] = [
    { id: 'a1', name: 'Football' } as Activity,
    { id: 'a2', name: 'Tennis' } as Activity
  ];

  const mockEventDetails: EventDetails = {
    id: 'e1',
    title: 'Match',
    description: 'Match amical',
    eventDate: '2026-02-01',
    startTime: '10:00',
    endTime: '12:00',
    addressLabel: 'Paris',
    address: {
      street: 'Rue de Paris',
      city: 'Paris',
      postalCode: '75001'
    },
    activityName: 'Football',
    organizerName: 'John',
    level: 'BEGINNER',
    material: 'Ballon',
    status: 'OPEN',
    maxParticipants: 10,
    participationStatus: null,
    acceptedParticipants: [],
    pendingParticipants: [],
    rejectedParticipants: [],
    activityId: null
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EditEventFacade,
        { provide: EventService, useValue: jasmine.createSpyObj('EventService', ['fetchEventById', 'updateEvent']) },
        { provide: ActivityService, useValue: jasmine.createSpyObj('ActivityService', ['fetchAllActivities']) },
        { provide: AddressService, useValue: jasmine.createSpyObj('AddressService', ['getAddressSuggestions']) },
        { provide: SuccessHandlerService, useValue: jasmine.createSpyObj('SuccessHandlerService', ['handle']) }
      ]
    });

    facade = TestBed.inject(EditEventFacade);
    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    activityService = TestBed.inject(ActivityService) as jasmine.SpyObj<ActivityService>;
    addressService = TestBed.inject(AddressService) as jasmine.SpyObj<AddressService>;
    successHandler = TestBed.inject(SuccessHandlerService) as jasmine.SpyObj<SuccessHandlerService>;
  });

  it('should load activities and event and set activityId', () => {
    activityService.fetchAllActivities.and.returnValue(of(mockActivities));
    eventService.fetchEventById.and.returnValue(of(mockEventDetails));

    facade.loadEvent('e1').subscribe();

    expect(activityService.fetchAllActivities).toHaveBeenCalled();
    expect(eventService.fetchEventById).toHaveBeenCalledWith('e1');

    expect(facade.activities()).toEqual(mockActivities);
    expect(facade.event()?.activityId).toBe('a1');
  });

  it('should update event and refresh state', () => {
    const payload = { title: 'Updated' } as EventRequest;

    eventService.updateEvent.and.returnValue(
      of({
        message: 'Updated',
        data: { ...mockEventDetails, title: 'Updated' }
      })
    );

    facade.updateEvent('e1', payload).subscribe();

    expect(eventService.updateEvent).toHaveBeenCalledWith('e1', payload);
    expect(successHandler.handle).toHaveBeenCalled();
    expect(facade.event()?.title).toBe('Updated');
  });

  it('should load address suggestions', () => {
    const suggestions: AddressSuggestion[] = [
      {
        label: 'Paris',
        street: 'Rue de Paris',
        city: 'Paris',
        postalCode: '75001'
      }
    ];

    addressService.getAddressSuggestions.and.returnValue(of(suggestions));

    facade.getAddressSuggestions('par').subscribe();

    expect(addressService.getAddressSuggestions).toHaveBeenCalledWith('par');
    expect(facade.addressSuggestions()).toEqual(suggestions);
  });
});
