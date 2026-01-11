import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthFacade } from '../../../core/facades/auth/auth.facade';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

const mockApiResponse = {
    success: true,
    message: 'Email envoyé',
    data: null,
};

describe('ForgotPasswordComponent', () => {
    let component: ForgotPasswordComponent;
    let fixture: ComponentFixture<ForgotPasswordComponent>;
    let authFacade: jasmine.SpyObj<AuthFacade>;
    let notification: jasmine.SpyObj<NotificationService>;

    beforeEach(async () => {
        authFacade = jasmine.createSpyObj(
            'AuthFacade',
            ['requestPasswordReset'],
            { isSubmitting: false }
        );

        authFacade.requestPasswordReset.and.returnValue(of(mockApiResponse));

        notification = jasmine.createSpyObj('NotificationService', [
            'showWarning',
        ]);

        await TestBed.configureTestingModule({
            imports: [
                ForgotPasswordComponent,
                RouterTestingModule,
            ],
            providers: [
                { provide: AuthFacade, useValue: authFacade },
                { provide: NotificationService, useValue: notification },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ForgotPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should show warning if form is invalid', () => {
        component.onSubmit();

        expect(notification.showWarning).toHaveBeenCalledWith(
            'Veuillez entrer une adresse e-mail valide.'
        );
        expect(authFacade.requestPasswordReset).not.toHaveBeenCalled();
    });

    it('should submit form and call requestPasswordReset with normalized email', () => {
    component.form.setValue({
        email: 'TEST@TEST.COM', 
    });

    component.onSubmit();

    expect(authFacade.requestPasswordReset).toHaveBeenCalledWith(
        'test@test.com'
    );
    });

    it('should expose isSubmitting from facade', () => {
        expect(component.isSubmitting).toBeFalse();
    });
});
