import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminUsersComponent } from './admin-users.component';
import { AdminFacade } from '../../../core/facades/admin/admin.facade';
import { DialogService } from '../../../core/services/dialog.service/dialog.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('AdminUsersComponent', () => {
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;
  let adminFacade: jasmine.SpyObj<AdminFacade>;
  let dialogService: jasmine.SpyObj<DialogService>;

  beforeEach(async () => {
    const adminFacadeSpy = jasmine.createSpyObj(
      'AdminFacade',
      [
        'loadUsers',
        'softDeleteUser',
        'restoreUser',
        'hardDeleteUser'
      ],
      {
        users: signal([]),
        loading: signal(false),
        error: signal(null)
      }
    );

    adminFacadeSpy.loadUsers.and.returnValue(of(void 0));
    adminFacadeSpy.softDeleteUser.and.returnValue(of(void 0));
    adminFacadeSpy.restoreUser.and.returnValue(of(void 0));
    adminFacadeSpy.hardDeleteUser.and.returnValue(of(void 0));

    const dialogSpy = jasmine.createSpyObj('DialogService', ['confirm']);

    await TestBed.configureTestingModule({
      imports: [AdminUsersComponent],
      providers: [
        { provide: AdminFacade, useValue: adminFacadeSpy },
        { provide: DialogService, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    adminFacade = TestBed.inject(AdminFacade) as jasmine.SpyObj<AdminFacade>;
    dialogService = TestBed.inject(DialogService) as jasmine.SpyObj<DialogService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    component.ngOnInit();

    expect(adminFacade.loadUsers).toHaveBeenCalled();
  });

  it('should soft delete a user', () => {
    component.softDeleteUser('user-id');

    expect(adminFacade.softDeleteUser).toHaveBeenCalledOnceWith('user-id');
  });

  it('should restore a user', () => {
    component.restoreUser('user-id');

    expect(adminFacade.restoreUser).toHaveBeenCalledOnceWith('user-id');
  });

  it('should NOT hard delete user if dialog is cancelled', () => {
    dialogService.confirm.and.returnValue(of(false));

    component.hardDeleteUser('user-id');

    expect(dialogService.confirm).toHaveBeenCalled();
    expect(adminFacade.hardDeleteUser).not.toHaveBeenCalled();
  });

  it('should hard delete user if dialog is confirmed', () => {
    dialogService.confirm.and.returnValue(of(true));

    component.hardDeleteUser('user-id');

    expect(dialogService.confirm).toHaveBeenCalled();
    expect(adminFacade.hardDeleteUser).toHaveBeenCalledOnceWith('user-id');
  });

  it('should expose facade signals', () => {
    expect(component.users()).toEqual([]);
    expect(component.loading()).toBeFalse();
    expect(component.error()).toBeNull();
  });
});
