import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { UserFacade } from './user.facade';
import { UserService } from '../../services/user/user.service';
import { SignalsService } from '../../services/signals/signals.service';
import { SuccessHandlerService } from '../../services/success-handler/success-handler.service';

import { User } from '../../models/user.model';
import { ApiResponse } from '../../models/api-response.model';

describe('UserFacade', () => {
  let facade: UserFacade;

  let userService: jasmine.SpyObj<UserService>;
  let signals: jasmine.SpyObj<SignalsService>;
  let successHandler: jasmine.SpyObj<SuccessHandlerService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: 'u1',
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserFacade,
        {
          provide: UserService,
          useValue: jasmine.createSpyObj('UserService', [
            'getCurrentUser',
            'updateMyProfile',
            'uploadProfilePicture',
            'deleteProfilePicture',
            'deleteMyAccount'
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
          provide: SuccessHandlerService,
          useValue: jasmine.createSpyObj('SuccessHandlerService', ['handle'])
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate'])
        }
      ]
    });

    facade = TestBed.inject(UserFacade);
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    signals = TestBed.inject(SignalsService) as jasmine.SpyObj<SignalsService>;
    successHandler = TestBed.inject(SuccessHandlerService) as jasmine.SpyObj<SuccessHandlerService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should load current user and sync signals', () => {
    const response: ApiResponse<User> = {
      message: 'OK',
      data: mockUser
    };

    userService.getCurrentUser.and.returnValue(of(response));

    facade.getCurrentUser().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    expect(signals.updateCurrentUser).toHaveBeenCalledWith(mockUser);
    expect(facade.user()).toEqual(mockUser);
  });

  it('should load user and update signal', () => {
    const response: ApiResponse<User> = {
      message: 'OK',
      data: mockUser
    };

    userService.getCurrentUser.and.returnValue(of(response));

    facade.loadUser().subscribe();

    expect(facade.user()).toEqual(mockUser);
  });

  it('should update profile and redirect', () => {
    const response: ApiResponse<User> = {
      message: 'Profile updated',
      data: mockUser
    };

    userService.updateMyProfile.and.returnValue(of(response));

    facade.updateMyProfile({ firstName: 'John' }).subscribe();

    expect(signals.updateCurrentUser).toHaveBeenCalledWith(mockUser);
    expect(successHandler.handle).toHaveBeenCalledWith(response);
    expect(router.navigate).toHaveBeenCalledWith(['/profile']);
  });

  it('should upload profile picture', () => {
    const response: ApiResponse<User> = {
      message: 'Picture uploaded',
      data: mockUser
    };

    userService.uploadProfilePicture.and.returnValue(of(response));

    facade.uploadProfilePicture(new File([], 'avatar.png')).subscribe();

    expect(signals.updateCurrentUser).toHaveBeenCalledWith(mockUser);
    expect(successHandler.handle).toHaveBeenCalledWith(response);
  });

  it('should delete profile picture', () => {
    const response: ApiResponse<User> = {
      message: 'Picture deleted',
      data: mockUser
    };

    userService.deleteProfilePicture.and.returnValue(of(response));

    facade.deleteProfilePicture().subscribe();

    expect(signals.updateCurrentUser).toHaveBeenCalledWith(mockUser);
    expect(successHandler.handle).toHaveBeenCalledWith(response);
  });

  it('should delete account and logout user', () => {
    const response: ApiResponse<void> = {
      message: 'Account deleted',
      data: undefined
    };

    userService.deleteMyAccount.and.returnValue(of(response));

    facade.deleteMyAccount().subscribe();

    expect(successHandler.handle).toHaveBeenCalledWith(response);
    expect(signals.clearCurrentUser).toHaveBeenCalled();
    expect(facade.user()).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
