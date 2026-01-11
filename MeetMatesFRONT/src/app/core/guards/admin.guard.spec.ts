import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { SignalsService } from '../services/signals/signals.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let router: jasmine.SpyObj<Router>;
  let signals: jasmine.SpyObj<SignalsService>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    signals = jasmine.createSpyObj('SignalsService', [
      'isAuthenticated',
      'isAdmin'
    ]);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: Router, useValue: router },
        { provide: SignalsService, useValue: signals }
      ]
    });

    guard = TestBed.inject(AdminGuard);
  });

  it('should deny access and redirect to /login when not authenticated', () => {
    signals.isAuthenticated.and.returnValue(false);

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
    expect(signals.isAdmin).not.toHaveBeenCalled();
  });

  it('should deny access and redirect to /forbidden when authenticated but not admin', () => {
    signals.isAuthenticated.and.returnValue(true);
    signals.isAdmin.and.returnValue(false);

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/forbidden']);
  });

  it('should allow access when authenticated and admin', () => {
    signals.isAuthenticated.and.returnValue(true);
    signals.isAdmin.and.returnValue(true);

    const result = guard.canActivate();

    expect(result).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
