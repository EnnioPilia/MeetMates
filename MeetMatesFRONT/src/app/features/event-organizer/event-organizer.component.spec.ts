import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { EventOrganizerComponent } from './event-organizer.component';
import { EventFacade } from '../../core/facades/events/event/event.facade';
import { DialogService } from '../../core/services/dialog.service/dialog.service';
import { ProfileFacade } from '../../core/facades/profile/profile.facade';
import { EventDetails } from '../../core/models/event-details.model';
import { EventUser } from '../../core/models/event-user.model';
import { ApiResponse } from '../../core/models/api-response.model';
import { EventResponse } from '../../core/models/event-response.model';

describe('EventOrganizerComponent', () => {
    let component: EventOrganizerComponent;
    let fixture: any;

    let eventFacadeSpy: jasmine.SpyObj<EventFacade>;
    let dialogServiceSpy: jasmine.SpyObj<DialogService>;
    let profileFacadeSpy: jasmine.SpyObj<ProfileFacade>;
    let routerSpy: jasmine.SpyObj<Router>;

    const mockProfileLoadResult = {
        organized: [] as EventResponse[],
        participating: [] as EventResponse[]
    };

    const mockVoidResponse: ApiResponse<void> = {
        message: 'ok',
        data: undefined
    };
    
    const mockEvent: EventDetails = {
        id: 'e1',
        title: 'Event test',
        description: 'Description test',
        eventDate: '2026-01-11',
        startTime: '10:00',
        endTime: '12:00',

        addressLabel: 'Salle A',
        address: {
            street: '1 rue de Paris',
            city: 'Paris',
            postalCode: '75000'
        },

        activityName: 'Football',
        level: 'BEGINNER',
        material: 'Chaussures',
        status: 'OPEN',
        maxParticipants: 10,
        participationStatus: null,

        acceptedParticipants: [] as EventUser[],
        pendingParticipants: [] as EventUser[],
        rejectedParticipants: [] as EventUser[],

        organizerName: 'John Doe',
        activityId: 'a1'
    };


    beforeEach(async () => {
        eventFacadeSpy = jasmine.createSpyObj(
            'EventFacade',
            ['load', 'acceptParticipant', 'rejectParticipant', 'deleteEvent'],
            {
                event: signal(mockEvent),
                loading: signal(false),
                error: signal(null)
            }
        );

        eventFacadeSpy.load.and.returnValue(of(mockEvent));


        eventFacadeSpy.load.and.returnValue(of(mockEvent));
        eventFacadeSpy.acceptParticipant.and.returnValue(of(mockVoidResponse));
        eventFacadeSpy.rejectParticipant.and.returnValue(of(mockVoidResponse));
        eventFacadeSpy.deleteEvent.and.returnValue(of(mockVoidResponse));

        dialogServiceSpy = jasmine.createSpyObj('DialogService', ['confirm']);
        dialogServiceSpy.confirm.and.returnValue(of(true));

        profileFacadeSpy = jasmine.createSpyObj('ProfileFacade', ['loadProfile']);
        profileFacadeSpy.loadProfile.and.returnValue(of(mockProfileLoadResult));

        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [EventOrganizerComponent],
            providers: [
                { provide: EventFacade, useValue: eventFacadeSpy },
                { provide: DialogService, useValue: dialogServiceSpy },
                { provide: ProfileFacade, useValue: profileFacadeSpy },
                { provide: Router, useValue: routerSpy },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: new Map([['eventId', 'e1']])
                        }
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EventOrganizerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load event on init', () => {
        expect(eventFacadeSpy.load).toHaveBeenCalledWith('e1');
    });

    it('should accept participant and refresh event', () => {
        spyOn(component, 'refresh');

        component.onAccept('p1');

        expect(eventFacadeSpy.acceptParticipant).toHaveBeenCalledWith('p1');
        expect(component.refresh).toHaveBeenCalled();
    });

    it('should reject participant and refresh event', () => {
        spyOn(component, 'refresh');

        component.onReject('p1');

        expect(eventFacadeSpy.rejectParticipant).toHaveBeenCalledWith('p1');
        expect(component.refresh).toHaveBeenCalled();
    });

    it('should delete event after confirmation and navigate to profile', () => {
        component.deleteEvent();

        expect(dialogServiceSpy.confirm).toHaveBeenCalled();
        expect(eventFacadeSpy.deleteEvent).toHaveBeenCalledWith('e1');
        expect(profileFacadeSpy.loadProfile).toHaveBeenCalled();
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('should NOT delete event if confirmation is cancelled', () => {
        dialogServiceSpy.confirm.and.returnValue(of(false));

        component.deleteEvent();

        expect(eventFacadeSpy.deleteEvent).not.toHaveBeenCalled();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should reload event on refresh()', () => {
        component.refresh();

        expect(eventFacadeSpy.load).toHaveBeenCalledWith('e1');
    });
});
