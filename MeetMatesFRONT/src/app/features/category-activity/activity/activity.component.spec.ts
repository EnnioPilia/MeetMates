import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { signal } from '@angular/core';

import { ActivityComponent } from './activity.component';
import { ActivityFacade } from '../../../core/facades/activity/activity.facade';

const mockActivities = [
  { id: '1', name: 'Yoga', categoryId: 'cat1' },
  { id: '2', name: 'Pilates', categoryId: 'cat1' },
];

describe('ActivityComponent', () => {
  let component: ActivityComponent;
  let fixture: ComponentFixture<ActivityComponent>;
  let activityFacade: jasmine.SpyObj<ActivityFacade>;
  let router: jasmine.SpyObj<Router>;

  function createActivatedRoute(categoryId: string | null) {
    return {
      snapshot: {
        paramMap: {
          get: () => categoryId,
        },
      },
    };
  }

beforeEach(async () => {
activityFacade = jasmine.createSpyObj<ActivityFacade>(
  'ActivityFacade',
  ['loadActivities'],
  {
    loading: signal(false),
    error: signal(null),
    activities: signal(mockActivities),
  }
);

  activityFacade.loadActivities.and.returnValue(of([]));

  router = jasmine.createSpyObj<Router>('Router', ['navigate']);

  await TestBed.configureTestingModule({
    imports: [ActivityComponent],
    providers: [
      { provide: ActivityFacade, useValue: activityFacade },
      { provide: Router, useValue: router },
      {
        provide: ActivatedRoute,
        useValue: createActivatedRoute(null),
      },
    ],
  }).compileComponents();
});


  function createComponent(categoryId: string | null) {
    TestBed.overrideProvider(ActivatedRoute, {
      useValue: createActivatedRoute(categoryId),
    });

    fixture = TestBed.createComponent(ActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent(null);
    expect(component).toBeTruthy();
  });

  it('should load activities on init when categoryId exists', () => {
    createComponent('category-123');

    expect(activityFacade.loadActivities).toHaveBeenCalledWith('category-123');
  });

  it('should NOT load activities when categoryId is missing', () => {
    createComponent(null);

    expect(activityFacade.loadActivities).not.toHaveBeenCalled();
  });

  it('should navigate to events when goToEvents is called', () => {
    createComponent('category-123');

    component.goToEvents('activity-456');

    expect(router.navigate).toHaveBeenCalledWith(['/events', 'activity-456']);
  });

  it('should expose facade states', () => {
    createComponent('category-123');

    expect(component.loading).toBe(activityFacade.loading);
    expect(component.error).toBe(activityFacade.error);
    expect(component.activities).toBe(activityFacade.activities);
  });
});
