import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';

import { ErrorHandlerService } from './error-handler.service';
import { NotificationService } from '../notification/notification.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;
  let notificationSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    notificationSpy = jasmine.createSpyObj('NotificationService', ['showError']);

    TestBed.configureTestingModule({
      providers: [
        ErrorHandlerService,
        { provide: NotificationService, useValue: notificationSpy }
      ]
    });

    service = TestBed.inject(ErrorHandlerService);
  });

  it('should display server unreachable message for status 0', () => {
    const error = new HttpErrorResponse({ status: 0 });

    const handled = service.handle(error);

    expect(notificationSpy.showError).toHaveBeenCalledWith(
      'Impossible de contacter le serveur.'
    );
    expect(handled).toBeTrue();
  });

  it('should display backend message when provided', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { message: 'Erreur métier' }
    });

    const handled = service.handle(error);

    expect(notificationSpy.showError).toHaveBeenCalledWith('Erreur métier');
    expect(handled).toBeTrue();
  });

  it('should display default message when no backend message', () => {
    const error = new HttpErrorResponse({ status: 401 });

    const handled = service.handle(error);

    expect(notificationSpy.showError).toHaveBeenCalledWith(
      'Vous devez vous authentifier.'
    );
    expect(handled).toBeTrue();
  });

  it('should return false for unhandled status', () => {
    const error = new HttpErrorResponse({ status: 418 });

    const handled = service.handle(error);

    expect(notificationSpy.showError).not.toHaveBeenCalled();
    expect(handled).toBeFalse();
  });

});
