import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { ActivityFacade } from './activity.facade';
import { ActivityService } from '../../services/activity/activity.service';
import { Activity } from '../../models/activity.model';
import { Category } from '../../models/category.model';

describe('ActivityFacade', () => {
  let facade: ActivityFacade;
  let activityService: jasmine.SpyObj<ActivityService>;

  beforeEach(() => {
    const activityServiceSpy = jasmine.createSpyObj<ActivityService>(
      'ActivityService',
      ['fetchAllCategories', 'fetchActivitiesByCategory']
    );

    TestBed.configureTestingModule({
      providers: [
        ActivityFacade,
        { provide: ActivityService, useValue: activityServiceSpy }
      ]
    });

    facade = TestBed.inject(ActivityFacade);
    activityService = TestBed.inject(
      ActivityService
    ) as jasmine.SpyObj<ActivityService>;
  });

  it('should load categories and update signal', () => {
    const mockCategories: Category[] = [
      { id: '1', name: 'Sport' },
      { id: '2', name: 'Culture' }
    ] as Category[];

    activityService.fetchAllCategories.and.returnValue(of(mockCategories));

    facade.loadCategories().subscribe();

    expect(activityService.fetchAllCategories).toHaveBeenCalled();
    expect(facade.categories()).toEqual(mockCategories);
  });

  it('should load activities for a category and update signal', () => {
    const categoryId = '1';

    const mockActivities: Activity[] = [
      { id: 'a1', name: 'Football', categoryId: '1' },
      { id: 'a2', name: 'Basket', categoryId: '1' }
    ] as Activity[];

    activityService.fetchActivitiesByCategory.and.returnValue(
      of(mockActivities)
    );

    facade.loadActivities(categoryId).subscribe();

    expect(activityService.fetchActivitiesByCategory)
      .toHaveBeenCalledWith(categoryId);

    expect(facade.activities()).toEqual(mockActivities);
  });

  it('should not update categories when service fails', () => {
    activityService.fetchAllCategories.and.returnValue(
      throwError(() => new Error('API error'))
    );

    facade.loadCategories().subscribe({
      error: () => {
        expect(facade.categories()).toEqual([]);
      }
    });
  });
});
