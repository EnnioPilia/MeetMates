import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditEventPage } from './edit-event.component';
import { EditEventFacade } from '../../core/facades/events/edit-event/edit-event.facade';
import { Router, ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { EventFormValue } from '../../core/models/event-form.model';
import { EventFormMapper } from '../../core/mappers/event-form.mapper';
import { EventDetails } from '../../core/models/event-details.model';

describe('EditEventComponent', () => {
    let component: EditEventPage;
    let fixture: ComponentFixture<EditEventPage>;
    let facade: jasmine.SpyObj<EditEventFacade>;
    let router: jasmine.SpyObj<Router>;

    const mockEvent: EventDetails = {
        id: 'event1',
        title: 'Test Event',
        description: 'Desc',
        eventDate: '2026-01-11',
        startTime: '10:00',
        endTime: '12:00',
        addressLabel: '123 Street',
        address: { street: '123 Street', city: 'Paris', postalCode: '75001' },
        activityName: 'Yoga',
        organizerName: 'Organizer',
        level: 'Beginner',
        material: 'Mat',
        status: 'OPEN',
        maxParticipants: 10,
        participationStatus: null,
        acceptedParticipants: [],
        pendingParticipants: [],
        rejectedParticipants: [],
        activityId: 'act1'
    };
    const mockActivities = [
        { id: '1', name: 'Football', categoryId: 'cat1' },
        { id: '2', name: 'Basketball', categoryId: 'cat1' },
    ];
    beforeEach(async () => {
        facade = jasmine.createSpyObj<EditEventFacade>(
            'EditEventFacade',
            ['loadEvent', 'updateEvent', 'getAddressSuggestions'],
            {
                event: signal(mockEvent),
                activities: signal([]),
                addressSuggestions: signal([]),
                loading: signal(false),
                error: signal(null),
            }
        );

        facade.loadEvent.and.returnValue(
            of([mockActivities, mockEvent] as [typeof mockActivities, typeof mockEvent])
        ); 
        facade.updateEvent.and.returnValue(of({ message: 'ok', data: mockEvent }));
        facade.getAddressSuggestions.and.returnValue(of([]));

        router = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [EditEventPage],
            providers: [
                { provide: EditEventFacade, useValue: facade },
                { provide: Router, useValue: router },
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { paramMap: { get: () => 'event1' } } },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(EditEventPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call loadEvent on init', () => {
        expect(facade.loadEvent).toHaveBeenCalledWith('event1');
    });

    it('should expose event via signal', () => {
        expect(component.event()).toEqual(mockEvent);
    });

    it('should compute formData from event', () => {
        const expectedFormData = EventFormMapper.toFormValue(mockEvent);
        expect(component.formData()).toEqual(expectedFormData);
    });

    it('should update event and navigate on success', () => {
        const formValue: EventFormValue = {
            title: 'Updated Event',
            description: 'Updated Desc',
            eventDate: new Date(),
            startTime: '09:00',
            endTime: '11:00',
            maxParticipants: 20,
            material: 'Updated Mat',
            level: 'Intermediate',
            activityId: 'act1',
            address: { street: 'Street', city: 'City', postalCode: '75000' }
        };

        component.update(formValue);

        expect(facade.updateEvent).toHaveBeenCalledWith(
            'event1',
            EventFormMapper.toUpdateRequest(formValue, 'OPEN')
        );
        expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it('should not update if event is null', () => {
        (facade.event as any).set(null);

        const formValue: EventFormValue = {
            title: 'Updated Event',
            description: 'Updated Desc',
            eventDate: new Date(),
            startTime: '09:00',
            endTime: '11:00',
            maxParticipants: 20,
            material: 'Updated Mat',
            level: 'Intermediate',
            activityId: 'act1',
            address: { street: 'Street', city: 'City', postalCode: '75000' }
        };

        component.update(formValue);

        expect(facade.updateEvent).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should call getAddressSuggestions when searching', () => {
        component.searchAddress('Paris');

        expect(facade.getAddressSuggestions).toHaveBeenCalledWith('Paris');
    });
});
