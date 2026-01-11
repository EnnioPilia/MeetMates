import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventInfoComponent } from './event-info.component';
import { EventDetails } from '../../core/models/event-details.model';

describe('EventInfoComponent', () => {
  let component: EventInfoComponent;
  let fixture: ComponentFixture<EventInfoComponent>;

  const mockEvent: EventDetails = {
    id: '1',
    title: 'Event test',
    description: 'Description',
    eventDate: '2024-06-01',
    startTime: '10:00:00',
    endTime: '12:30:00',
    addressLabel: 'Paris',
    address: {
      street: 'Rue test',
      city: 'Paris',
      postalCode: '75000'
    },
    activityName: 'Running',
    organizerName: 'John Doe',
    level: 'BEGINNER',
    material: 'NONE',
    status: 'OPEN',
    maxParticipants: 10,
    participationStatus: null,
    acceptedParticipants: [],
    pendingParticipants: [],
    rejectedParticipants: [],
    activityId: 'act-1'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventInfoComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EventInfoComponent);
    component = fixture.componentInstance;
    component.event = mockEvent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return formatted status label', () => {
    expect(component.statusLabel).toBeTruthy();
  });

  it('should return formatted level label', () => {
    expect(component.levelLabel).toBeTruthy();
  });

  it('should return formatted material label', () => {
    expect(component.materialLabel).toBeTruthy();
  });

  it('should return event date', () => {
    expect(component.eventDate).toBe('2024-06-01');
  });

  it('should format event time correctly', () => {
    expect(component.eventTime).toBe('10:00 - 12:30');
  });

  it('should handle missing values safely', () => {
    component.event = {
      ...mockEvent,
      status: '',
      level: '',
      material: '',
      startTime: undefined as any,
      endTime: undefined as any
    };

    expect(component.statusLabel).toBe('');
    expect(component.levelLabel).toBe('');
    expect(component.materialLabel).toBe('');
  });
});
