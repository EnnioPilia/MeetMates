import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BackButtonComponent } from './back-button.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

describe('BackButtonComponent', () => {
  let component: BackButtonComponent;
  let fixture: ComponentFixture<BackButtonComponent>;
  let locationSpy: jasmine.SpyObj<Location>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    locationSpy = jasmine.createSpyObj('Location', ['back']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [BackButtonComponent],
      providers: [
        { provide: Location, useValue: locationSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BackButtonComponent);
    component = fixture.componentInstance;
  });

  it('should go back when history length > 1', () => {
    spyOnProperty(window, 'history').and.returnValue({ length: 2 } as History);

    component.goBack();

    expect(locationSpy.back).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to fallback route when no history', () => {
    spyOnProperty(window, 'history').and.returnValue({ length: 1 } as History);

    component.fallbackRoute = '/home';
    component.goBack();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    expect(locationSpy.back).not.toHaveBeenCalled();
  });
});
