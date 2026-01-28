import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from './app.component';
import { SignalsService } from './core/services/signals/signals.service';
import { AuthFacade } from './core/facades/auth/auth.facade';

const routerEvents$ = new Subject<any>();

const routerSpy = {
  events: routerEvents$.asObservable(),
  navigate: jasmine.createSpy('navigate'),
};

const activatedRouteMock: any = {
  root: {
    firstChild: null,
    snapshot: {
      data: {}
    }
  }
};

const signalsServiceMock = {
  pageTitle: signal('MeetMates'),
  currentUser: signal(null),
  setPageTitle: jasmine.createSpy('setPageTitle')
};

const authFacadeSpy = jasmine.createSpyObj('AuthFacade', ['loadCurrentUser']);
authFacadeSpy.loadCurrentUser.and.returnValue(of({}));

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: SignalsService, useValue: signalsServiceMock },
        { provide: AuthFacade, useValue: authFacadeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on init', () => {
    expect(authFacadeSpy.loadCurrentUser).toHaveBeenCalled();
  });

  it('should update page title on NavigationEnd', () => {
    routerEvents$.next(new NavigationEnd(1, '/test', '/test'));

    expect(signalsServiceMock.setPageTitle)
      .toHaveBeenCalledWith('MeetMates');
  });

  it('should fallback to default title when no route title is provided', () => {
    activatedRouteMock.root.snapshot.data = {};

    routerEvents$.next(new NavigationEnd(1, '/', '/'));

    expect(signalsServiceMock.setPageTitle)
      .toHaveBeenCalledWith('MeetMates');
  });
});
