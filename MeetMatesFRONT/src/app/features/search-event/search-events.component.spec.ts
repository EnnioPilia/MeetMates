import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SearchEventsComponent } from './search-events.component';
import { EventService } from '../../core/services/event/event.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { EventMapperService } from '../../core/mappers/event-mapper';

// Models
import { EventResponse } from '../../core/models/event-response.model';
import { EventListItem } from '../../core/models/event-list-item.model';

describe('SearchEventsComponent', () => {
    let component: SearchEventsComponent;
    let fixture: ComponentFixture<SearchEventsComponent>;

    let eventServiceSpy: jasmine.SpyObj<EventService>;
    let notificationSpy: jasmine.SpyObj<NotificationService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let mapperSpy: jasmine.SpyObj<EventMapperService>;

    const mockApiResponse: EventResponse[] = [
        { id: 'e1' } as EventResponse
    ];

    const mockMappedResult: EventListItem[] = [
        {
            eventId: 'e1',
            activityId: 'a1',
            title: 'Event test'
        } as EventListItem
    ];

    beforeEach(async () => {
        eventServiceSpy = jasmine.createSpyObj('EventService', ['searchEvents']);
        notificationSpy = jasmine.createSpyObj('NotificationService', ['showError']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        mapperSpy = jasmine.createSpyObj('EventMapperService', ['toEventList']);

        eventServiceSpy.searchEvents.and.returnValue(of(mockApiResponse));
        mapperSpy.toEventList.and.callFake((responses: EventResponse[]) => {
            return responses.length ? mockMappedResult : [];
        });
        await TestBed.configureTestingModule({
            imports: [
                SearchEventsComponent,
                ReactiveFormsModule
            ],
            providers: [
                { provide: EventService, useValue: eventServiceSpy },
                { provide: NotificationService, useValue: notificationSpy },
                { provide: Router, useValue: routerSpy },
                { provide: EventMapperService, useValue: mapperSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SearchEventsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should search events after debounce when query changes', fakeAsync(() => {
        component.form.controls['query'].setValue('football');

        tick(400);

        expect(eventServiceSpy.searchEvents).toHaveBeenCalledWith('football');
        expect(mapperSpy.toEventList).toHaveBeenCalledWith(mockApiResponse);
        expect(component.results()).toEqual(mockMappedResult);
        expect(component.loadingSearch()).toBeFalse();
    }));

    it('should clear results when query is empty', fakeAsync(() => {
        component.form.controls['query'].setValue('football');
        tick(400);

        expect(component.results().length).toBe(1);

        component.form.controls['query'].setValue('');
        tick(400);

        expect(component.results()).toEqual([]);
        expect(component.loadingSearch()).toBeFalse();
    }));


    it('should handle search error', fakeAsync(() => {
        eventServiceSpy.searchEvents.and.returnValue(
            throwError(() => new Error('API error'))
        );

        component.form.controls['query'].setValue('error');
        tick(400);

        expect(component.loadingSearch()).toBeFalse();
        expect(component.error()).toBe('Impossible de charger les événements.');
        expect(notificationSpy.showError)
            .toHaveBeenCalledWith('Erreur lors de la recherche des événements.');
    }));

    it('should navigate to event details', () => {
        const item: EventListItem = {
            eventId: 'e1',
            activityId: 'a1'
        } as EventListItem;

        component.goToEventDetails(item);

        expect(routerSpy.navigate).toHaveBeenCalledWith(
            ['/events', 'a1'],
            { queryParams: { eventId: 'e1' } }
        );
    });
});
