import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VerifyComponent } from './verify.component';
import { AuthFacade } from '../../../core/facades/auth/auth.facade';

describe('VerifyComponent', () => {
  let component: VerifyComponent;
  let fixture: ComponentFixture<VerifyComponent>;
  let authFacade: jasmine.SpyObj<AuthFacade>;

  function createActivatedRoute(token: string | null) {
    return {
      snapshot: {
        queryParamMap: {
          get: () => token,
        },
      },
    };
  }

  beforeEach(async () => {
    authFacade = jasmine.createSpyObj<AuthFacade>('AuthFacade', ['verifyEmail']);

    await TestBed.configureTestingModule({
      imports: [VerifyComponent],
      providers: [
        { provide: AuthFacade, useValue: authFacade },
        {
          provide: ActivatedRoute,
          useValue: createActivatedRoute(null),
        },
      ],
    }).compileComponents();
  });

  function createComponent(token: string | null) {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: createActivatedRoute(token),
    });

    fixture = TestBed.createComponent(VerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent(null);
    expect(component).toBeTruthy();
  });

  it('should show error if token is missing', () => {
    createComponent(null);

    expect(component.success).toBeFalse();
    expect(component.message).toBe('❌ Token de vérification manquant.');
    expect(authFacade.verifyEmail).not.toHaveBeenCalled();
  });

  it('should verify email successfully when token is valid', () => {
    authFacade.verifyEmail.and.returnValue(of(true));

    createComponent('valid-token');

    expect(authFacade.verifyEmail).toHaveBeenCalledWith('valid-token');
    expect(component.success).toBeTrue();
    expect(component.message).toBe('Votre compte a été activé avec succès.');
  });

  it('should show error when verification fails', () => {
    authFacade.verifyEmail.and.returnValue(of(false));

    createComponent('invalid-token');

    expect(authFacade.verifyEmail).toHaveBeenCalledWith('invalid-token');
    expect(component.success).toBeFalse();
    expect(component.message).toBe('Erreur lors de la vérification du compte.');
  });
});
