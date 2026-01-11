import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryComponent } from './category.component';
import { ActivityFacade } from '../../../core/facades/activity/activity.facade';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let activityFacade: jasmine.SpyObj<ActivityFacade>;
  let router: jasmine.SpyObj<Router>;

  const mockCategories = [
    { id: 'cat1', name: 'Sports' },
    { id: 'cat2', name: 'Arts' },
  ];

  beforeEach(async () => {
    // Création du spy pour ActivityFacade avec des signals
    activityFacade = jasmine.createSpyObj<ActivityFacade>(
      'ActivityFacade',
      ['loadCategories'],
      {
        loading: signal(false),
        error: signal(null),
        categories: signal(mockCategories),
      }
    );

    activityFacade.loadCategories.and.returnValue(of(mockCategories));

    // Spy pour Router
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CategoryComponent],
      providers: [
        { provide: ActivityFacade, useValue: activityFacade },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadCategories on init', () => {
    expect(activityFacade.loadCategories).toHaveBeenCalled();
  });

  it('should expose categories via signal', () => {
    expect(component.categories()).toEqual(mockCategories);
  });

  it('should expose loading via signal', () => {
    expect(component.loading()).toBeFalse();
  });

  it('should expose error via signal', () => {
    expect(component.error()).toBeNull();
  });

  it('should navigate to selected category', () => {
    component.navigateTo('cat1');
    expect(router.navigate).toHaveBeenCalledWith(['/activity/cat1']);
  });
});
