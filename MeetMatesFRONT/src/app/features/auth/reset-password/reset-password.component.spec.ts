import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthFacade } from '../../../core/facades/auth/auth.facade';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authFacade: jasmine.SpyObj<AuthFacade>;
  let notification: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    authFacade = jasmine.createSpyObj(
      'AuthFacade',
      ['resetPassword'],
      { isSubmitting: false }
    );

    authFacade.resetPassword.and.returnValue(
    of({ message: 'ok', data: null })
    );

    notification = jasmine.createSpyObj('NotificationService', [
      'showWarning',
      'showError',
    ]);

    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent],
      providers: [
        { provide: AuthFacade, useValue: authFacade },
        { provide: NotificationService, useValue: notification },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: () => 'reset-token-123',
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read token from query params on init', () => {
    expect(component.token).toBe('reset-token-123');
  });

  it('should show warning if form is invalid', () => {
    component.onSubmit();

    expect(notification.showWarning).toHaveBeenCalled();
    expect(authFacade.resetPassword).not.toHaveBeenCalled();
  });

  it('should show error if passwords do not match', () => {
    component.form.setValue({
      newPassword: 'password123',
      confirmPassword: 'password456',
    });

    component.onSubmit();

    expect(notification.showError).toHaveBeenCalledWith(
      'Les mots de passe ne correspondent pas.'
    );
    expect(authFacade.resetPassword).not.toHaveBeenCalled();
  });

  it('should show error if token is missing', () => {
    component.token = null;

    component.form.setValue({
      newPassword: 'password123',
      confirmPassword: 'password123',
    });

    component.onSubmit();

    expect(notification.showError).toHaveBeenCalledWith(
      '❌ Lien de réinitialisation invalide ou expiré.'
    );
    expect(authFacade.resetPassword).not.toHaveBeenCalled();
  });

  it('should submit form and call resetPassword with token and new password', () => {
    component.form.setValue({
      newPassword: 'password123',
      confirmPassword: 'password123',
    });

    component.onSubmit();

    expect(authFacade.resetPassword).toHaveBeenCalledWith(
      'reset-token-123',
      'password123'
    );
  });

  it('should expose isSubmitting from facade', () => {
    expect(component.isSubmitting).toBeFalse();
  });
});
