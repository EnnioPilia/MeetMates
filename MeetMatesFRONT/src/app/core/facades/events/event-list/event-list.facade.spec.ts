import { TestBed } from '@angular/core/testing';
import { of, EMPTY } from 'rxjs';

import { EventListFacade } from './event-list.facade';

import { EventService } from '../../../services/event/event.service';
import { EventUserService } from '../../../services/event-user/event-user.service';
import { ActivityService } from '../../../services/activity/activity.service';
import { UserService } from '../../../services/user/user.service';
import { SignalsService } from '../../../services/signals/signals.service';
import { SuccessHandlerService } from '../../../services/success-handler/success-handler.service';
import { NotificationService } from '../../../services/notification/notification.service';

import { EventResponse } from '../../../models/event-response.model';
import { User } from '../../../models/user.model';

describe('EventListFacade', () => {
    let facade: EventListFacade;

    let eventService: jasmine.SpyObj<EventService>;
    let eventUserService: jasmine.SpyObj<EventUserService>;
    let activityService: jasmine.SpyObj<ActivityService>;
    let userService: jasmine.SpyObj<UserService>;
    let signals: jasmine.SpyObj<SignalsService>;
    let successHandler: jasmine.SpyObj<SuccessHandlerService>;
    let notification: jasmine.SpyObj<NotificationService>;

    const mockUser: User = {
        id: 'u1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        age: 30,
        city: 'Paris',
        role: 'USER',
        status: 'ACTIVE',
        profilePictureUrl: null
    };

    const mockEvent: EventResponse = {
        id: 'e1',
        title: 'Football Match',
        description: 'Match amical',
        eventDate: '2026-02-01',
        startTime: '10:00',
        endTime: '12:00',
        maxParticipants: 10,
        status: 'OPEN',
        material: 'Ballon',
        level: 'BEGINNER',
        activityName: 'Football',
        activityId: 'a1',
        addressLabel: 'Paris',
        organizerName: 'Alice',
        organizerId: 'u2',
        participantNames: []
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                EventListFacade,
                { provide: EventService, useValue: jasmine.createSpyObj('EventService', ['fetchAllEvents', 'fetchEventsByActivity']) },
                { provide: EventUserService, useValue: jasmine.createSpyObj('EventUserService', ['joinEvent']) },
                { provide: ActivityService, useValue: jasmine.createSpyObj('ActivityService', ['fetchActivityById']) },
                { provide: UserService, useValue: jasmine.createSpyObj('UserService', ['getCurrentUser']) },
                {
                    provide: SignalsService,
                    useValue: jasmine.createSpyObj('SignalsService', [
                        'updateCurrentUser',
                        'setPageTitle',
                        'currentUser'
                    ])
                },
                { provide: SuccessHandlerService, useValue: jasmine.createSpyObj('SuccessHandlerService', ['handle']) },
                { provide: NotificationService, useValue: jasmine.createSpyObj('NotificationService', ['showError', 'showWarning']) }
            ]
        });

        facade = TestBed.inject(EventListFacade);
        eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
        eventUserService = TestBed.inject(EventUserService) as jasmine.SpyObj<EventUserService>;
        activityService = TestBed.inject(ActivityService) as jasmine.SpyObj<ActivityService>;
        userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
        signals = TestBed.inject(SignalsService) as jasmine.SpyObj<SignalsService>;
        successHandler = TestBed.inject(SuccessHandlerService) as jasmine.SpyObj<SuccessHandlerService>;
        notification = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    });

    it('should load current user and update signals', () => {
        userService.getCurrentUser.and.returnValue(
            of({ message: 'ok', data: mockUser })
        );

        facade.loadCurrentUser().subscribe();

        expect(facade.currentUser()).toEqual(mockUser);
        expect(signals.updateCurrentUser).toHaveBeenCalledWith(mockUser);
    });

    it('should load all events', () => {
        eventService.fetchAllEvents.and.returnValue(of([mockEvent]));

        facade.loadAllEvents().subscribe();

        expect(eventService.fetchAllEvents).toHaveBeenCalled();
        expect(facade.events()).toEqual([mockEvent]);
    });

    it('should load events by activity', () => {
        eventService.fetchEventsByActivity.and.returnValue(of([mockEvent]));

        facade.loadEventsByActivity('a1').subscribe();

        expect(eventService.fetchEventsByActivity).toHaveBeenCalledWith('a1');
        expect(facade.events()).toEqual([mockEvent]);
    });

    it('should set page title from activity', () => {
        activityService.fetchActivityById.and.returnValue(
            of({ id: 'a1', name: 'Football' })
        );

        facade.loadActivityName('a1').subscribe();

        expect(signals.setPageTitle).toHaveBeenCalledWith('Football');
    });

    it('should block join if user is not logged in', () => {
        signals.currentUser.and.returnValue(null);

        facade.joinEvent('e1').subscribe({ complete: () => { } });

        expect(notification.showError).toHaveBeenCalled();
    });

    it('should block join if user is organizer', () => {
        signals.currentUser.and.returnValue(mockUser);
        facade.events.set([{ ...mockEvent, organizerId: mockUser.id }]);

        facade.joinEvent('e1').subscribe({ complete: () => { } });

        expect(notification.showWarning).toHaveBeenCalled();
    });

    it('should block join if event is not available', () => {
        signals.currentUser.and.returnValue(mockUser);
        facade.events.set([{ ...mockEvent, status: 'FULL' }]);

        facade.joinEvent('e1').subscribe({ complete: () => { } });

        expect(notification.showError).toHaveBeenCalled();
    });

    it('should join event successfully', () => {
        signals.currentUser.and.returnValue(mockUser);
        facade.events.set([mockEvent]);

        eventUserService.joinEvent.and.returnValue(
            of({ message: 'Joined', data: undefined })
        );

        facade.joinEvent('e1').subscribe();

        expect(eventUserService.joinEvent).toHaveBeenCalledWith('e1');
        expect(successHandler.handle).toHaveBeenCalled();
    });
});
