import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminEventsComponent } from './admin-events.component';
import { AdminFacade } from '../../../core/facades/admin/admin.facade';
import { DialogService } from '../../../core/services/dialog.service/dialog.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('AdminEventsComponent', () => {
  let component: AdminEventsComponent;
  let fixture: ComponentFixture<AdminEventsComponent>;
  let adminFacade: jasmine.SpyObj<AdminFacade>;
  let dialogService: jasmine.SpyObj<DialogService>;

  beforeEach(async () => {
    const adminFacadeSpy = jasmine.createSpyObj(
      'AdminFacade',
      [
        'loadEvents',
        'softDeleteEvent',
        'restoreEvent',
        'hardDeleteEvent'
      ],
      {
        events: signal([]),
        loading: signal(false),
        error: signal(null)
      }
    );

    adminFacadeSpy.loadEvents.and.returnValue(of(void 0));
    adminFacadeSpy.softDeleteEvent.and.returnValue(of(void 0));
    adminFacadeSpy.restoreEvent.and.returnValue(of(void 0));
    adminFacadeSpy.hardDeleteEvent.and.returnValue(of(void 0));

    const dialogSpy = jasmine.createSpyObj('DialogService', ['confirm']);

    await TestBed.configureTestingModule({
      imports: [AdminEventsComponent],
      providers: [
        { provide: AdminFacade, useValue: adminFacadeSpy },
        { provide: DialogService, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEventsComponent);
    component = fixture.componentInstance;
    adminFacade = TestBed.inject(AdminFacade) as jasmine.SpyObj<AdminFacade>;
    dialogService = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load events on init', () => {
    component.ngOnInit();

    expect(adminFacade.loadEvents).toHaveBeenCalled();
  });

  it('should soft delete an event', () => {
    component.softDeleteEvent('event-id');

    expect(adminFacade.softDeleteEvent).toHaveBeenCalledOnceWith('event-id');
  });

  it('should restore an event', () => {
    component.restoreEvent('event-id');

    expect(adminFacade.restoreEvent).toHaveBeenCalledOnceWith('event-id');
  });

  it('should NOT hard delete event if dialog is cancelled', () => {
    dialogService.confirm.and.returnValue(of(false));

    component.hardDeleteEvent('event-id');

    expect(dialogService.confirm).toHaveBeenCalled();
    expect(adminFacade.hardDeleteEvent).not.toHaveBeenCalled();
  });

  it('should hard delete event if dialog is confirmed', () => {
    dialogService.confirm.and.returnValue(of(true));

    component.hardDeleteEvent('event-id');

    expect(dialogService.confirm).toHaveBeenCalled();
    expect(adminFacade.hardDeleteEvent).toHaveBeenCalledOnceWith('event-id');
  });

  it('should expose facade signals', () => {
    expect(component.events()).toEqual([]);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBeNull();
  });
});
