import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { PostEventPage } from './post-event.component';
import { EventFacade } from '../../core/facades/events/event/event.facade';
import { EventFormMapper } from '../../core/mappers/event-form.mapper';
import { EventFormValue } from '../../core/models/event-form.model';
import { AddressSuggestion } from '../../core/services/address/address.service';
import { Activity } from '../../core/models/activity.model';
import { ApiResponse } from '../../core/models/api-response.model';
import { EventDetails } from '../../core/models/event-details.model';

describe('PostEventComponent', () => {
    let component: PostEventPage;
    let fixture: ComponentFixture<PostEventPage>;

    let eventFacadeSpy: jasmine.SpyObj<EventFacade>;

    const mockEventDetails: EventDetails = {
        id: 'e1',
        title: 'Event test',
        description: 'Description',
        eventDate: '2026-01-11',
        startTime: '10:00',
        endTime: '12:00',
        addressLabel: 'Salle A',
        address: {
            street: '1 rue test',
            city: 'Paris',
            postalCode: '75000'
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
        activityId: 'a1'
    };

    const mockActivities: Activity[] = [
        { id: 'a1', name: 'Football' } as Activity
    ];

    const mockAddressSuggestions: AddressSuggestion[] = [
        {
            label: '1 rue test, Paris',
            street: '1 rue test',
            city: 'Paris',
            postalCode: '75000'
        }
    ];

    const mockCreateResponse: ApiResponse<EventDetails> = {
        message: 'Event created',
        data: mockEventDetails
    };

    const mockFormValue: EventFormValue = {
        title: 'Event test',
        description: 'Description',
        eventDate: new Date(2026, 0, 11),
        startTime: '10:00',
        endTime: '12:00',
        maxParticipants: 10,
        material: 'Ballon',
        level: 'BEGINNER',
        activityId: 'a1',
        address: {
            street: '1 rue test',
            city: 'Paris',
            postalCode: '75000'
        }
    };

    beforeEach(async () => {
        eventFacadeSpy = jasmine.createSpyObj(
            'EventFacade',
            ['loadActivities', 'searchAddress', 'createEvent'],
            {
                activities: signal(mockActivities),
                addressSuggestions: signal(mockAddressSuggestions),
                loading: signal(false),
                error: signal(null)
            }
        );

        const activatedRouteMock = {
            snapshot: {
                paramMap: {
                    get: jasmine.createSpy('get').and.returnValue(null)
                }
            }
        };
        eventFacadeSpy.loadActivities.and.returnValue(of(mockActivities));
        eventFacadeSpy.searchAddress.and.returnValue(of(mockAddressSuggestions));
        eventFacadeSpy.createEvent.and.returnValue(of(mockCreateResponse));

        await TestBed.configureTestingModule({
            imports: [PostEventPage],
            providers: [
                { provide: EventFacade, useValue: eventFacadeSpy },
                { provide: ActivatedRoute, useValue: activatedRouteMock }
            ]
        }).compileComponents();


        fixture = TestBed.createComponent(PostEventPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ---------------------------------------------------------------------------
    // Base
    // ---------------------------------------------------------------------------

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ---------------------------------------------------------------------------
    // Init
    // ---------------------------------------------------------------------------

    it('should load activities on init', () => {
        expect(eventFacadeSpy.loadActivities).toHaveBeenCalled();
    });

    // ---------------------------------------------------------------------------
    // Address search
    // ---------------------------------------------------------------------------

    it('should search address when query is provided', () => {
        component.searchAddress('Paris');

        expect(eventFacadeSpy.searchAddress).toHaveBeenCalledWith('Paris');
    });

    // ---------------------------------------------------------------------------
    // Create event
    // ---------------------------------------------------------------------------

    it('should map form value and call createEvent', () => {
        const mapperSpy = spyOn(EventFormMapper, 'toCreateRequest').and.callThrough();

        component.create(mockFormValue);

        expect(mapperSpy).toHaveBeenCalledWith(mockFormValue);
        expect(eventFacadeSpy.createEvent).toHaveBeenCalled();
    });
});
