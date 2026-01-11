import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { ProfileComponent } from './profile.component';
import { ProfileFacade } from '../../core/facades/profile/profile.facade';
import { DialogService } from '../../core/services/dialog.service/dialog.service';
import { EventResponse } from '../../core/models/event-response.model';
import { ApiResponse } from '../../core/models/api-response.model';

describe('ProfileComponent', () => {
    let component: ProfileComponent;
    let fixture: ComponentFixture<ProfileComponent>;

    let profileFacadeSpy: jasmine.SpyObj<ProfileFacade>;
    let dialogServiceSpy: jasmine.SpyObj<DialogService>;
    let routerSpy: jasmine.SpyObj<Router>;

    const mockApiResponseNull: ApiResponse<null> = {
        message: 'ok',
        data: null
    };
    const mockApiResponseVoid: ApiResponse<void> = {
        message: 'ok',
        data: undefined
    };
    const mockLoadProfileResponse: {
        organized: EventResponse[];
        participating: EventResponse[];
    } = {
        organized: [],
        participating: []
    };

    beforeEach(async () => {
        profileFacadeSpy = jasmine.createSpyObj(
            'ProfileFacade',
            ['loadProfile', 'logout', 'deleteAccount'],
            {
                user: signal(null),
                eventsParticipating: signal([]),
                eventsOrganized: signal([]),
                loading: signal(false),
                error: signal(null)
            }
        );

        dialogServiceSpy = jasmine.createSpyObj('DialogService', [
            'confirm',
            'openCgu',
            'openMentions'
        ]);

        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        profileFacadeSpy.loadProfile.and.returnValue(of(mockLoadProfileResponse));
        profileFacadeSpy.logout.and.returnValue(of(mockApiResponseNull));
        profileFacadeSpy.deleteAccount.and.returnValue(of(mockApiResponseVoid));

        dialogServiceSpy.confirm.and.returnValue(of(true));

        await TestBed.configureTestingModule({
            imports: [ProfileComponent],
            providers: [
                { provide: ProfileFacade, useValue: profileFacadeSpy },
                { provide: DialogService, useValue: dialogServiceSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    // ---------------------------------------------------------------------------
    // Base
    // ---------------------------------------------------------------------------

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // ---------------------------------------------------------------------------
    // Init
    // ---------------------------------------------------------------------------

    it('should load profile on init', () => {
        expect(profileFacadeSpy.loadProfile).toHaveBeenCalled();
    });

    // ---------------------------------------------------------------------------
    // Logout
    // ---------------------------------------------------------------------------

    it('should logout when confirmation is accepted', () => {
        dialogServiceSpy.confirm.and.returnValue(of(true));

        component.onLogout();

        expect(dialogServiceSpy.confirm).toHaveBeenCalled();
        expect(profileFacadeSpy.logout).toHaveBeenCalled();
    });

    it('should not logout when confirmation is cancelled', () => {
        dialogServiceSpy.confirm.and.returnValue(of(false));

        component.onLogout();

        expect(profileFacadeSpy.logout).not.toHaveBeenCalled();
    });

    // ---------------------------------------------------------------------------
    // Delete account
    // ---------------------------------------------------------------------------

    it('should delete account when confirmation is accepted', () => {
        dialogServiceSpy.confirm.and.returnValue(of(true));

        component.onDeleteAccount();

        expect(dialogServiceSpy.confirm).toHaveBeenCalled();
        expect(profileFacadeSpy.deleteAccount).toHaveBeenCalled();
    });

    // ---------------------------------------------------------------------------
    // Navigation
    // ---------------------------------------------------------------------------

    it('should navigate to edit profile page', () => {
        component.onEditProfile();

        expect(routerSpy.navigate).toHaveBeenCalledWith(['/edit-profile']);
    });

    // ---------------------------------------------------------------------------
    // Dialogs
    // ---------------------------------------------------------------------------

    it('should open CGU dialog', () => {
        component.openCguDialog();

        expect(dialogServiceSpy.openCgu).toHaveBeenCalled();
    });

    it('should open mentions dialog', () => {
        component.openMentionsDialog();

        expect(dialogServiceSpy.openMentions).toHaveBeenCalled();
    });
});
