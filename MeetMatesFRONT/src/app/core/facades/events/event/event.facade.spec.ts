import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { EventFacade } from './event.facade';
import { ActivityService } from '../../../services/activity/activity.service';
import { EventService } from '../../../services/event/event.service';
import { EventUserService } from '../../../services/event-user/event-user.service';
import { AddressService } from '../../../services/address/address.service';
import { SuccessHandlerService } from '../../../services/success-handler/success-handler.service';

import { Activity } from '../../../models/activity.model';
import { EventDetails } from '../../../models/event-details.model';
import { EventRequest } from '../../../models/event-request.model';
import { AddressSuggestion } from '../../../services/address/address.service';
import { ApiResponse } from '../../../models/api-response.model';

describe('EventFacade', () => {
    let facade: EventFacade;

    let activityService: jasmine.SpyObj<ActivityService>;
    let eventService: jasmine.SpyObj<EventService>;
    let eventUserService: jasmine.SpyObj<EventUserService>;
    let addressService: jasmine.SpyObj<AddressService>;
    let successHandler: jasmine.SpyObj<SuccessHandlerService>;

    const mockEventDetails: EventDetails = {
        id: 'e1',
        title: 'Event test',
        description: 'Description',
        eventDate: '2026-01-01',
        startTime: '10:00',
        endTime: '12:00',
        addressLabel: 'Paris',
        address: {
            street: 'Rue de Paris',
            city: 'Paris',
            postalCode: '75001'
        },
        activityName: 'Football',
        organizerName: 'John Doe',
        level: 'Débutant',
        material: 'Ballon',
        status: 'OPEN',
        maxParticipants: 10,
        participationStatus: null,
        acceptedParticipants: [],
        pendingParticipants: [],
        rejectedParticipants: [],
        activityId: 'a1'
    };

    const mockEventRequest: EventRequest = {
        title: 'Event',
        description: 'Description',
        eventDate: '2026-01-01',
        startTime: '10:00',
        endTime: '12:00',
        maxParticipants: 10,
        status: 'OPEN',
        material: 'Ballon',
        level: 'Débutant',
        activityId: 'a1',
        address: {
            street: 'Rue de Paris',
            city: 'Paris',
            postalCode: '75001',
            country: 'FR'
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EventFacade,
                {
                    provide: ActivityService,
                    useValue: jasmine.createSpyObj('ActivityService', [
                        'fetchAllActivities'
                    ])
                },
                {
                    provide: EventService,
                    useValue: jasmine.createSpyObj('EventService', [
                        'createEvent',
                        'deleteEvent',
                        'fetchEventById'
                    ])
                },
                {
                    provide: EventUserService,
                    useValue: jasmine.createSpyObj('EventUserService', [
                        'acceptParticipant',
                        'rejectParticipant',
                        'leaveEvent'
                    ])
                },
                {
                    provide: AddressService,
                    useValue: jasmine.createSpyObj('AddressService', [
                        'getAddressSuggestions'
                    ])
                },
                {
                    provide: SuccessHandlerService,
                    useValue: jasmine.createSpyObj('SuccessHandlerService', [
                        'handle'
                    ])
                }
            ]
        });

        facade = TestBed.inject(EventFacade);
        activityService = TestBed.inject(ActivityService) as jasmine.SpyObj<ActivityService>;
        eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
        eventUserService = TestBed.inject(EventUserService) as jasmine.SpyObj<EventUserService>;
        addressService = TestBed.inject(AddressService) as jasmine.SpyObj<AddressService>;
        successHandler = TestBed.inject(SuccessHandlerService) as jasmine.SpyObj<SuccessHandlerService>;
    });

    // -----------------------------
    // loadActivities
    // -----------------------------
    it('should load activities and update signal', () => {
        const activities: Activity[] = [{ id: '1', name: 'Sport' } as Activity];

        activityService.fetchAllActivities.and.returnValue(of(activities));

        facade.loadActivities().subscribe();

        expect(activityService.fetchAllActivities).toHaveBeenCalled();
        expect(facade.activities()).toEqual(activities);
    });

    // -----------------------------
    // createEvent
    // -----------------------------
    it('should create event and call success handler', () => {
        eventService.createEvent.and.returnValue(
            of({
                message: 'Event created',
                data: mockEventDetails
            })
        );
        facade.createEvent(mockEventRequest).subscribe();

        expect(eventService.createEvent).toHaveBeenCalledWith(mockEventRequest);
        expect(successHandler.handle).toHaveBeenCalled();
        expect(facade.isSubmitting).toBeFalse();
    });

    // -----------------------------
    // acceptParticipant
    // -----------------------------
    it('should accept participant', () => {
        eventUserService.acceptParticipant.and.returnValue(
            of<ApiResponse<void>>({ message: 'Accepted', data: undefined })
        );

        facade.acceptParticipant('eu1').subscribe();

        expect(eventUserService.acceptParticipant).toHaveBeenCalledWith('eu1');
        expect(successHandler.handle).toHaveBeenCalled();
        expect(facade.isSubmitting).toBeFalse();
    });

    // -----------------------------
    // deleteEvent
    // -----------------------------
    it('should delete event', () => {
        eventService.deleteEvent.and.returnValue(
            of<ApiResponse<void>>({ message: 'Deleted', data: undefined })
        );

        facade.deleteEvent('e1').subscribe();

        expect(eventService.deleteEvent).toHaveBeenCalledWith('e1');
        expect(successHandler.handle).toHaveBeenCalled();
        expect(facade.isSubmitting).toBeFalse();
    });

    // -----------------------------
    // load event
    // -----------------------------
    it('should load event details', () => {
        eventService.fetchEventById.and.returnValue(
            of(mockEventDetails)
        );

        facade.load('e1').subscribe();

        expect(eventService.fetchEventById).toHaveBeenCalledWith('e1');
        expect(facade.event()).toEqual(mockEventDetails);
    });

    // -----------------------------
    // searchAddress
    // -----------------------------
    it('should load address suggestions', () => {
        const suggestions: AddressSuggestion[] = [
            {
                label: 'Paris',
                street: 'Rue de Rivoli',
                city: 'Paris',
                postalCode: '75001'
            }
        ];

        addressService.getAddressSuggestions.and.returnValue(of(suggestions));

        facade.searchAddress('par').subscribe();

        expect(addressService.getAddressSuggestions).toHaveBeenCalledWith('par');
        expect(facade.addressSuggestions()).toEqual(suggestions);
    });
});
