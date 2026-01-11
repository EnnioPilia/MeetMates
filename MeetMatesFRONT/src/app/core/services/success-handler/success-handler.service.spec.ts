import { TestBed } from '@angular/core/testing';
import { SuccessHandlerService } from './success-handler.service';
import { NotificationService } from '../notification/notification.service';

describe('SuccessHandlerService', () => {
  let service: SuccessHandlerService;
  let notificationService: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', [
      'showSuccess'
    ]);

    TestBed.configureTestingModule({
      providers: [
        SuccessHandlerService,
        { provide: NotificationService, useValue: notificationSpy }
      ]
    });

    service = TestBed.inject(SuccessHandlerService);
    notificationService = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;
  });

  // ----------------------------
  // standard behavior
  // ----------------------------
  it('should display backend success message when provided', () => {
    const res = { message: 'Succès backend' };

    service.handle(res);

    expect(notificationService.showSuccess).toHaveBeenCalledOnceWith(
      'Succès backend'
    );
  });

  it('should display fallback message when backend message is missing', () => {
    const res = {};

    service.handle(res, 'Message fallback');

    expect(notificationService.showSuccess).toHaveBeenCalledOnceWith(
      'Message fallback'
    );
  });

  it('should display default message when no backend or fallback message is provided', () => {
    const res = {};

    service.handle(res);

    expect(notificationService.showSuccess).toHaveBeenCalledOnceWith(
      '✔️ Opération effectuée avec succès.'
    );
  });

  // ----------------------------
  // silent mode
  // ----------------------------
  it('should not display any message when silent option is enabled', () => {
    const res = { message: 'Ne doit pas apparaître' };

    service.handle(res, undefined, { silent: true });

    expect(notificationService.showSuccess).not.toHaveBeenCalled();
  });

  // ----------------------------
  // edge cases
  // ----------------------------
  it('should ignore non-string message values', () => {
    const res = { message: 123 };

    service.handle(res, 'Fallback');

    expect(notificationService.showSuccess).toHaveBeenCalledOnceWith(
      'Fallback'
    );
  });

  it('should handle null or undefined response safely', () => {
    service.handle(null as any, 'Fallback');

    expect(notificationService.showSuccess).toHaveBeenCalledOnceWith(
      'Fallback'
    );
  });
});
