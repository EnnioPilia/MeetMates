import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthFacade } from './auth.facade';
import { AuthService } from '../../services/auth/auth.service';
import { SignalsService } from '../../services/signals/signals.service';
import { NotificationService } from '../../services/notification/notification.service';
import { User } from '../../models/user.model';

describe('AuthFacade', () => {
    let facade: AuthFacade;
    let authService: jasmine.SpyObj<AuthService>;
    let signalsService: jasmine.SpyObj<SignalsService>;
    let notificationService: jasmine.SpyObj<NotificationService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthFacade,
                {
                    provide: AuthService,
                    useValue: jasmine.createSpyObj('AuthService', [
                        'register',
                        'login',
                        'logout',
                        'getMe',
                        'requestPasswordReset',
                        'resetPassword',
                        'verifyEmail'
                    ])
                },
                {
                    provide: SignalsService,
                    useValue: jasmine.createSpyObj('SignalsService', [
                        'updateCurrentUser',
                        'clearCurrentUser'
                    ])
                },
                {
                    provide: NotificationService,
                    useValue: jasmine.createSpyObj('NotificationService', [
                        'showSuccess'
                    ])
                },
                {
                    provide: Router,
                    useValue: jasmine.createSpyObj('Router', ['navigate'])
                }
            ]
        });

        facade = TestBed.inject(AuthFacade);
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        signalsService = TestBed.inject(SignalsService) as jasmine.SpyObj<SignalsService>;
        notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('should register user and navigate to login', () => {
        authService.register.and.returnValue(
            of({
                message: 'User created',
                data: null
            })
        );

        facade.register({ email: 'a@test.com', password: '123456' } as any)
            .subscribe();

        expect(authService.register).toHaveBeenCalled();
        expect(notificationService.showSuccess).toHaveBeenCalledWith('User created');
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        expect(facade.isSubmitting).toBeFalse();
    });

    it('should login user, load profile and navigate to home', () => {

        const mockUser: User = {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@test.com',
            age: 30,
            city: 'Paris',
            role: 'USER',
            status: 'ACTIVE',
            profilePictureUrl: null,
            deletedAt: null
        };

        authService.login.and.returnValue(
            of({
                message: 'Login success',
                data: null
            })
        );

        authService.getMe.and.returnValue(of(mockUser));

        facade.login('a@test.com', '123456').subscribe();

        expect(authService.login).toHaveBeenCalledWith({
            email: 'a@test.com',
            password: '123456'
        });

        expect(authService.getMe).toHaveBeenCalled();
        expect(signalsService.updateCurrentUser).toHaveBeenCalledWith(mockUser);
        expect(router.navigate).toHaveBeenCalledWith(['/home']);
        expect(facade.isSubmitting).toBeFalse();
    });

    it('should logout user and clear state', () => {
        authService.logout.and.returnValue(
            of({
                message: 'Logout success',
                data: null
            })
        );

        facade.logout().subscribe();

        expect(authService.logout).toHaveBeenCalled();
        expect(notificationService.showSuccess)
            .toHaveBeenCalledWith('Logout success');
        expect(signalsService.clearCurrentUser).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        expect(facade.isSubmitting).toBeFalse();
    });
});
