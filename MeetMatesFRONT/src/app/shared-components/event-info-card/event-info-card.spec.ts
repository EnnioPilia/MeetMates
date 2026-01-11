import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventInfoCardComponent } from './event-info-card';
import { EventDetails } from '../../core/models/event-details.model';

describe('EventInfoCardComponent', () => {
  let component: EventInfoCardComponent;
  let fixture: ComponentFixture<EventInfoCardComponent>;

  const mockEvent: Partial<EventDetails> = {
    id: 'e1',
    title: 'Event test',
    status: 'OPEN',
    activityName: 'Running'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventInfoCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EventInfoCardComponent);
    component = fixture.componentInstance;
    component.event = mockEvent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return status from event', () => {
    expect(component.status).toBe('OPEN');
  });

  it('should return hasStatus = true when status exists', () => {
    expect(component.hasStatus).toBeTrue();
  });

  it('should return mapped status label', () => {
    expect(component.statusLabel).toBeTruthy();
  });

  it('should return hasStatus = false when status is missing', () => {
    component.event = { title: 'No status event' };
    expect(component.hasStatus).toBeFalse();
  });

  it('should return empty label when status is missing', () => {
    component.event = {};
    expect(component.statusLabel).toBe('');
  });
});
