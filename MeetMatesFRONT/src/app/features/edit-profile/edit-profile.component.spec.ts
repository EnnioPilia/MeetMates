import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditProfileComponent } from './edit-profile.component';
import { UserFacade } from '../../core/facades/user/user.facade';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { User } from '../../core/models/user.model';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  let userFacade: jasmine.SpyObj<UserFacade>;

  const mockUser: User = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    age: 30,
    city: 'Paris',
    role: 'USER',
    status: 'ACTIVE',
    profilePictureUrl: null,
  };

  const mockApiResponse = {
    message: 'ok',
    data: mockUser,
  };

  beforeEach(async () => {
    userFacade = jasmine.createSpyObj<UserFacade>(
      'UserFacade',
      ['loadUser', 'updateMyProfile', 'uploadProfilePicture', 'deleteProfilePicture'],
      {
        user: signal(mockUser),
        loading: signal(false),
        error: signal(null),
      }
    );

    userFacade.loadUser.and.returnValue(of(mockUser));
    userFacade.updateMyProfile.and.returnValue(of(mockApiResponse));
    userFacade.uploadProfilePicture.and.returnValue(of(mockApiResponse));
    userFacade.deleteProfilePicture.and.returnValue(of(mockApiResponse));

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => null
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [EditProfileComponent],
      providers: [
        { provide: UserFacade, useValue: userFacade },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadUser on init', () => {
    expect(userFacade.loadUser).toHaveBeenCalled();
  });

  it('should expose user, loading, and error from facade', () => {
    expect(component.user()).toEqual(mockUser);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBeNull();
  });

  it('should call updateMyProfile on onSave', () => {
    const partialUser = { firstName: 'Jane' };
    component.onSave(partialUser);
    expect(userFacade.updateMyProfile).toHaveBeenCalledWith(partialUser);
  });

  it('should call uploadProfilePicture on onPhotoSelected', () => {
    const file = new File([], 'profile.png');
    component.onPhotoSelected(file);
    expect(userFacade.uploadProfilePicture).toHaveBeenCalledWith(file);
  });

  it('should call deleteProfilePicture on onPhotoDeleted', () => {
    component.onPhotoDeleted();
    expect(userFacade.deleteProfilePicture).toHaveBeenCalled();
  });
});
