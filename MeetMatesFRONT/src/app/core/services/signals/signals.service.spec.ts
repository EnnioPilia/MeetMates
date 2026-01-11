import { TestBed } from '@angular/core/testing';
import { SignalsService, CurrentUser } from './signals.service';
import { User } from '../../models/user.model';

describe('SignalsService', () => {
  let service: SignalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignalsService]
    });

    service = TestBed.inject(SignalsService);
  });

  // ----------------------------
  // pageTitle
  // ----------------------------
  it('should set page title', () => {
    service.setPageTitle('Profil');

    expect(service.pageTitle()).toBe('Profil');
  });

  // ----------------------------
  // dark mode
  // ----------------------------
  it('should toggle dark mode', () => {
    expect(service.darkMode()).toBeFalse();

    service.toggleDarkMode();
    expect(service.darkMode()).toBeTrue();

    service.toggleDarkMode();
    expect(service.darkMode()).toBeFalse();
  });

  // ----------------------------
  // menu
  // ----------------------------
  it('should toggle menu open state', () => {
    expect(service.isMenuOpen()).toBeFalse();

    service.toggleMenu();
    expect(service.isMenuOpen()).toBeTrue();

    service.toggleMenu();
    expect(service.isMenuOpen()).toBeFalse();
  });

  // ----------------------------
  // current user
  // ----------------------------
  it('should update current user from User model', () => {
    const user: User = {
      id: 'u1',
      firstName: 'Ennio',
      lastName: 'Pilia',
      email: 'ennio@test.com',
      age: 25,
      city: 'Grenoble',
      role: 'ADMIN',
      status: 'ACTIVE',
      profilePictureUrl: 'avatar.png'
    };

    service.updateCurrentUser(user);

    expect(service.currentUser()).toEqual({
      id: 'u1',
      firstName: 'Ennio',
      lastName: 'Pilia',
      email: 'ennio@test.com',
      role: 'ADMIN',
      profilePictureUrl: 'avatar.png'
    });
  });

  it('should clear current user when null is passed', () => {
    service.updateCurrentUser(null);

    expect(service.currentUser()).toBeNull();
  });

  it('should clear current user explicitly', () => {
    service.clearCurrentUser();

    expect(service.currentUser()).toBeNull();
  });

  // ----------------------------
  // auth helpers
  // ----------------------------
  it('should return true when user is authenticated', () => {
    service.currentUser.set({
      id: 'u1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@test.com',
      role: 'USER'
    });

    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return false when user is not authenticated', () => {
    service.clearCurrentUser();

    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should return true when user is admin', () => {
    service.currentUser.set({
      id: 'u1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@test.com',
      role: 'ADMIN'
    });

    expect(service.isAdmin()).toBeTrue();
  });

  it('should return false when user is not admin', () => {
    service.currentUser.set({
      id: 'u1',
      firstName: 'User',
      lastName: 'User',
      email: 'user@test.com',
      role: 'USER'
    });

    expect(service.isAdmin()).toBeFalse();
  });
});
