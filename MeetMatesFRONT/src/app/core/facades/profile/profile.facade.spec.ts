import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ProfileFacade } from './profile.facade';

import { UserFacade } from '../../facades/user/user.facade';
import { AuthFacade } from '../../facades/auth/auth.facade';
import { EventUserService } from '../../services/event-user/event-user.service';

import { User } from '../../models/user.model';
import { EventResponse } from '../../models/event-response.model';

describe('ProfileFacade', () => {
    let facade: ProfileFacade;

    let userFacade: jasmine.SpyObj<UserFacade>;
    let authFacade: jasmine.SpyObj<AuthFacade>;
    let eventUserService: jasmine.SpyObj<EventUserService>;

    const mockUser: User = {
        id: 'u1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@doe.com',
        age: 30,
        city: 'Paris',
        role: 'USER',
        status: 'ACTIVE',
        profilePictureUrl: null
    };


    const organizedEvents: EventResponse[] = [
        { id: 'e1', title: 'Org 1', eventId: 'e1' } as EventResponse
    ];

    const participatingEvents: EventResponse[] = [
        { id: 'e1', title: 'Org 1', eventId: 'e1' } as EventResponse,
        { id: 'e2', title: 'Part 2', eventId: 'e2' } as EventResponse
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProfileFacade,
                {
                    provide: UserFacade,
                    useValue: jasmine.createSpyObj('UserFacade', [
                        'getCurrentUser',
                        'deleteMyAccount'
                    ])
                },
                {
                    provide: AuthFacade,
                    useValue: jasmine.createSpyObj('AuthFacade', ['logout'])
                },
                {
                    provide: EventUserService,
                    useValue: jasmine.createSpyObj('EventUserService', [
                        'getOrganizedEvents',
                        'getParticipatingEvents'
                    ])
                }
            ]
        });

        facade = TestBed.inject(ProfileFacade);
        userFacade = TestBed.inject(UserFacade) as jasmine.SpyObj<UserFacade>;
        authFacade = TestBed.inject(AuthFacade) as jasmine.SpyObj<AuthFacade>;
        eventUserService = TestBed.inject(EventUserService) as jasmine.SpyObj<EventUserService>;
    });

    it('should load user profile and filter events correctly', () => {
        userFacade.getCurrentUser.and.returnValue(of(mockUser));
        eventUserService.getOrganizedEvents.and.returnValue(of(organizedEvents));
        eventUserService.getParticipatingEvents.and.returnValue(of(participatingEvents));

        facade.loadProfile().subscribe();

        expect(userFacade.getCurrentUser).toHaveBeenCalled();
        expect(eventUserService.getOrganizedEvents).toHaveBeenCalled();
        expect(eventUserService.getParticipatingEvents).toHaveBeenCalled();

        expect(facade.user()).toEqual(mockUser);
        expect(facade.eventsOrganized()).toEqual(organizedEvents);
        expect(facade.eventsParticipating()).toEqual([
            { id: 'e2', title: 'Part 2', eventId: 'e2' } as EventResponse
        ]);
    });

    it('should reset state and logout', () => {
        authFacade.logout.and.returnValue(
            of({
                message: 'Logout success',
                data: null
            })
        );

        facade.logout().subscribe();

        expect(authFacade.logout).toHaveBeenCalled();
        expect(facade.user()).toBeNull();
        expect(facade.eventsOrganized()).toEqual([]);
        expect(facade.eventsParticipating()).toEqual([]);
    });

    it('should delete user account', () => {
        userFacade.deleteMyAccount.and.returnValue(
            of({
                message: 'Account deleted',
                data: undefined
            })
        );

        facade.deleteAccount().subscribe();

        expect(userFacade.deleteMyAccount).toHaveBeenCalled();
    });

    it('should remove an organized event by id', () => {
        facade.eventsOrganized.set(organizedEvents);

        facade.removeOrganizedEvent('e1');

        expect(facade.eventsOrganized()).toEqual([]);
    });
});
