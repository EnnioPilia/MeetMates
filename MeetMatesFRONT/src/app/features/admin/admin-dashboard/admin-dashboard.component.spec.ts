import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminFacade } from '../../../core/facades/admin/admin.facade';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let facade: jasmine.SpyObj<AdminFacade>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const facadeSpy = jasmine.createSpyObj(
      'AdminFacade',
      ['loadUsers', 'loadEvents'],
      {
        users: signal([]),
        events: signal([]),
        loading: signal(false),
        error: signal(null)
      }
    );

    facadeSpy.loadUsers.and.returnValue(of(void 0));
    facadeSpy.loadEvents.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [
        AdminDashboardComponent,
        RouterTestingModule 
      ],
      providers: [
        { provide: AdminFacade, useValue: facadeSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    facade = TestBed.inject(AdminFacade) as jasmine.SpyObj<AdminFacade>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users and events on init', () => {
    component.ngOnInit();

    expect(facade.loadUsers).toHaveBeenCalled();
    expect(facade.loadEvents).toHaveBeenCalled();
  });

  it('should navigate to given path', () => {
    spyOn(router, 'navigate');

    component.goTo('/admin/users');

    expect(router.navigate).toHaveBeenCalledOnceWith(['/admin/users']);
  });

  it('should expose facade signals', () => {
    expect(component.users()).toEqual([]);
    expect(component.events()).toEqual([]);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBeNull();
  });
});
