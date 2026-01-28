import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, EMPTY } from 'rxjs';

import { EventParticipantComponent } from './event-participant.component';
import { EventFacade } from '../../core/facades/events/event/event.facade';
import { DialogService } from '../../core/services/dialog.service/dialog.service';
import { EventDetails } from '../../core/models/event-details.model';
import { ApiResponse } from '../../core/models/api-response.model';

describe('EventParticipantComponent', () => {
    let component: EventParticipantComponent;
    let fixture: ComponentFixture<EventParticipantComponent>;

    let eventFacadeSpy: jasmine.SpyObj<EventFacade>;
    let dialogServiceSpy: jasmine.SpyObj<DialogService>;
    let routerSpy: jasmine.SpyObj<Router>;

    const mockVoidResponse: ApiResponse<void> = {
        message: 'ok',
        data: undefined
    };

    const mockEvent: EventDetails = {
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
        participationStatus: 'ACCEPTED',
        acceptedParticipants: [],
        pendingParticipants: [],
        rejectedParticipants: [],
        activityId: 'a1'
    };

    beforeEach(async () => {
        eventFacadeSpy = jasmine.createSpyObj(
            'EventFacade',
            ['load', 'leave'],
            {
                event: signal(mockEvent),
                loading: signal(false),
                error: signal(null)
            }
        );

        eventFacadeSpy.load.and.returnValue(of(mockEvent));
        eventFacadeSpy.leave.and.returnValue(of(mockVoidResponse));

        dialogServiceSpy = jasmine.createSpyObj('DialogService', ['confirm']);
        dialogServiceSpy.confirm.and.returnValue(of(true));

        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [EventParticipantComponent],
            providers: [
                { provide: EventFacade, useValue: eventFacadeSpy },
                { provide: DialogService, useValue: dialogServiceSpy },
                { provide: Router, useValue: routerSpy },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: () => 'e1'
                            }
                        }
                    }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EventParticipantComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load event on init', () => {
        expect(eventFacadeSpy.load).toHaveBeenCalledWith('e1');
    });

    it('should cancel participation and navigate to profile when confirmed', () => {
        component.cancelParticipation('e1');

        expect(dialogServiceSpy.confirm).toHaveBeenCalled();
        expect(eventFacadeSpy.leave).toHaveBeenCalledWith('e1');
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('should not cancel participation if confirmation is false', () => {
        dialogServiceSpy.confirm.and.returnValue(of(false));

        component.cancelParticipation('e1');

        expect(eventFacadeSpy.leave).not.toHaveBeenCalled();
        expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should return formatted status label', () => {
        expect(component.getStatusLabel('OPEN')).toBeTruthy();
    });

    it('should return formatted level label', () => {
        expect(component.getLevelLabel('BEGINNER')).toBeTruthy();
    });

    it('should return formatted material label', () => {
        expect(component.getMaterialLabel('Ballon')).toBeTruthy();
    });

    it('should return formatted participation label', () => {
        expect(component.getParticipationLabel('ACCEPTED')).toBeTruthy();
    });
});
