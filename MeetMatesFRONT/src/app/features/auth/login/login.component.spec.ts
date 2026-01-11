import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthFacade } from '../../../core/facades/auth/auth.facade';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from '../../../core/models/user.model';

const mockUser: User = {
    id: '1',
    email: 'test@test.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'USER',
    age: 30,
    city: 'Paris',
    status: 'ACTIVE',
    profilePictureUrl: null,
};

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authFacade: jasmine.SpyObj<AuthFacade>;
    let notification: jasmine.SpyObj<NotificationService>;
    let router: Router;

    beforeEach(async () => {
        authFacade = jasmine.createSpyObj(
            'AuthFacade',
            ['login'],
            { isSubmitting: false }
        );

        authFacade.login.and.returnValue(of(mockUser));

        notification = jasmine.createSpyObj('NotificationService', [
            'showWarning',
        ]);

        await TestBed.configureTestingModule({
            imports: [
                LoginComponent,
                RouterTestingModule.withRoutes([]),
            ],
            providers: [
                { provide: AuthFacade, useValue: authFacade },
                { provide: NotificationService, useValue: notification },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        router = TestBed.inject(Router);

        spyOn(router, 'navigate');

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show warning if form is invalid', () => {
        component.onSubmit();

        expect(notification.showWarning).toHaveBeenCalled();
        expect(authFacade.login).not.toHaveBeenCalled();
    });

    it('should submit form and call login with normalized email', () => {
        component.form.setValue({
            email: 'TEST@TEST.COM',
            password: 'password123',
        });

        component.onSubmit();

        expect(authFacade.login).toHaveBeenCalledWith(
            'test@test.com',
            'password123'
        );
    });

    it('should expose isSubmitting from facade', () => {
        expect(component.isSubmitting).toBeFalse();
    });

    it('should navigate to given path', () => {
        component.navigateTo('register');

        expect(router.navigate).toHaveBeenCalledWith(['/register']);
    });
});
