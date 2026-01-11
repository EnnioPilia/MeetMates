import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IconCardComponent } from './icon-card.component';

describe('IconCardComponent', () => {
  let component: IconCardComponent;
  let fixture: ComponentFixture<IconCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(IconCardComponent);
    component = fixture.componentInstance;
    component.title = 'Test card';
    component.iconPath = 'icon.svg';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit cardClick event when onCardClick is called', () => {
    spyOn(component.cardClick, 'emit');

    component.onCardClick();

    expect(component.cardClick.emit).toHaveBeenCalled();
  });

  describe('cardSizeClass', () => {
    it('should return sm class when size is "sm"', () => {
      component.size = 'sm';
      expect(component.cardSizeClass).toBe('w-32 h-32');
    });

    it('should return lg class when size is "lg"', () => {
      component.size = 'lg';
      expect(component.cardSizeClass).toBe('w-40 h-40');
    });

    it('should return default class when size is "md"', () => {
      component.size = 'md';
      expect(component.cardSizeClass).toBe('w-40 h-40');
    });
  });
});
