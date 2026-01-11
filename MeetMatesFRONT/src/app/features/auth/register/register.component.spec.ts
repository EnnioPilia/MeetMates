import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthFacade } from '../../../core/facades/auth/auth.facade';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { DialogService } from '../../../core/services/dialog.service/dialog.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;
    let authFacade: jasmine.SpyObj<AuthFacade>;
    let notification: jasmine.SpyObj<NotificationService>;
    let dialogService: jasmine.SpyObj<DialogService>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(async () => {
        authFacade = jasmine.createSpyObj(
            'AuthFacade',
            ['register'],
            { isSubmitting: signal(false) }
        );

        authFacade.register.and.returnValue(
            of({ message: 'ok', data: null })
        );

        notification = jasmine.createSpyObj('NotificationService', [
            'showWarning',
            'showError'
        ]);

        dialogService = jasmine.createSpyObj('DialogService', ['openCgu']);

        router = jasmine.createSpyObj('Router', ['navigate']);

        TestBed.configureTestingModule({
            imports: [
                RegisterComponent,
                RouterTestingModule,
            ],
            providers: [
                { provide: AuthFacade, useValue: authFacade },
                { provide: NotificationService, useValue: notification },
                { provide: DialogService, useValue: dialogService },
            ],
        });

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(component.form).toBeDefined();
    });

    it('should show warning if form is invalid', () => {
        component.onSubmit();

        expect(notification.showWarning).toHaveBeenCalled();
        expect(authFacade.register).not.toHaveBeenCalled();
    });

    it('should show error if passwords do not match', () => {
        component.form.setValue({
            firstName: 'John',
            lastName: 'Doe',
            email: 'test@test.com',
            password: 'password123',
            confirmPassword: 'password456',
            acceptCgu: true
        });

        component.onSubmit();

        expect(notification.showError).toHaveBeenCalledWith(
            'Les mots de passe ne correspondent pas.'
        );
        expect(authFacade.register).not.toHaveBeenCalled();
    });

    it('should submit form and call register with normalized email', () => {
        component.form.setValue({
            firstName: 'John',
            lastName: 'Doe',
            email: 'TEST@TEST.COM',
            password: 'password123',
            confirmPassword: 'password123',
            acceptCgu: true
        });

        fixture.detectChanges();

        component.onSubmit();

        expect(authFacade.register).toHaveBeenCalledWith(
            jasmine.objectContaining({
                firstName: 'John',
                lastName: 'Doe',
                email: 'test@test.com',
                password: 'password123'
            })
        );
    });

    it('should open CGU dialog', () => {
        const event = jasmine.createSpyObj('event', ['preventDefault']);

        component.openCguDialog(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(dialogService.openCgu).toHaveBeenCalled();
    });

    it('should navigate to given path', () => {
        const router = TestBed.inject(Router);
        spyOn(router, 'navigate');

        component.navigateTo('login');

        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

});
