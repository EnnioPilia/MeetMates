import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { EventListComponent } from './event-list.component';
import { EventListFacade } from '../../core/facades/events/event-list/event-list.facade';
import { ApiResponse } from '../../core/models/api-response.model';
import { User } from '../../core/models/user.model';
import { Activity } from '../../core/models/activity.model';

describe('EventListComponent', () => {
    let component: EventListComponent;
    let fixture: any;
    let facadeSpy: jasmine.SpyObj<EventListFacade>;

    const mockActivity: Activity = {
        id: 'a1',
        name: 'Activity 1'
    };

    const mockUser: User = {
        id: 'u1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@test.com',
        age: 30,
        city: 'Paris',
        role: 'USER',
        status: 'ACTIVE',
        profilePictureUrl: null
    };
    
    const mockUserResponse: ApiResponse<User> = {
        message: 'Utilisateur chargé',
        data: mockUser
    };

    const mockEvents = [
        {
            id: '1',
            title: 'Event 1',
            description: 'Test event',
            status: 'OPEN',
            startTime: '10:00',
            endTime: '12:00',
            eventDate: '2026-01-11',
            maxParticipants: 10,
            material: '',
            level: 'Beginner',
            activityName: 'Activity 1',
            activityId: 'a1',
            addressLabel: 'Building A',
            organizerName: 'Organizer 1',
            organizerId: 'org1',
            participantNames: [],
            address: { street: 'Street 1', city: 'City 1', postalCode: '00000' }
        }
    ];

    beforeEach(async () => {
        facadeSpy = jasmine.createSpyObj(
            'EventListFacade',
            ['loadAllEvents', 'loadEventsByActivity', 'joinEvent', 'loadCurrentUser', 'loadActivityName'],
            {
                events: signal(mockEvents),
                loading: signal(false),
                error: signal(null)
            }
        );

        facadeSpy.loadCurrentUser.and.returnValue(
            of(mockUserResponse)
        );

        facadeSpy.loadAllEvents.and.returnValue(of(mockEvents));
        facadeSpy.loadEventsByActivity.and.returnValue(of(mockEvents));
        facadeSpy.loadActivityName.and.returnValue(
            of(mockActivity)
        );
        facadeSpy.joinEvent.and.returnValue(of({ message: 'ok', data: undefined }));

        await TestBed.configureTestingModule({
            imports: [EventListComponent],
            providers: [
                { provide: EventListFacade, useValue: facadeSpy },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: { paramMap: new Map() },
                        queryParams: of({})
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EventListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call loadAllEvents if no activityId in route', () => {
        expect(facadeSpy.loadAllEvents).toHaveBeenCalled();
    });

    it('should call joinEvent on joinEvent()', () => {
        component.joinEvent('1');
        expect(facadeSpy.joinEvent).toHaveBeenCalledWith('1');
    });

    it('should return correct event open status', () => {
        expect(component.isEventOpen(mockEvents[0] as any)).toBeTrue();
    });

    it('should format time correctly', () => {
        expect(component.formatTime('12:30')).toBe('12:30');
    });
});
