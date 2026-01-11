import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppButtonComponent } from './button.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppButtonComponent', () => {
  let component: AppButtonComponent;
  let fixture: ComponentFixture<AppButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppButtonComponent,
        RouterTestingModule // 🔥 FIX IMPORTANT
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppButtonComponent);
    component = fixture.componentInstance;
    component.label = 'Test button';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit "clicked" event when not disabled', () => {
    component.disabled = false;
    spyOn(component.clicked, 'emit');

    component.onClick();

    expect(component.clicked.emit).toHaveBeenCalled();
  });

  it('should NOT emit "clicked" event when disabled', () => {
    component.disabled = true;
    spyOn(component.clicked, 'emit');

    component.onClick();

    expect(component.clicked.emit).not.toHaveBeenCalled();
  });
});
