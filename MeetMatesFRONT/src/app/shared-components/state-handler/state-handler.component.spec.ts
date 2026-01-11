import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';

import { StateHandlerComponent } from './state-handler.component';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

describe('StateHandlerComponent', () => {
  let component: StateHandlerComponent;
  let fixture: ComponentFixture<StateHandlerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateHandlerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StateHandlerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.loading = signal(false);
    component.error = signal(null);

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display loading spinner when loading is true', () => {
    component.loading = signal(true);
    component.error = signal(null);

    fixture.detectChanges();

    const spinner = fixture.debugElement.query(
      By.directive(LoadingSpinnerComponent)
    );

    expect(spinner).toBeTruthy();
  });

  it('should NOT display loading spinner when loading is false', () => {
    component.loading = signal(false);
    component.error = signal(null);

    fixture.detectChanges();

    const spinner = fixture.debugElement.query(
      By.directive(LoadingSpinnerComponent)
    );

    expect(spinner).toBeNull();
  });

  it('should display error message when error signal has value', () => {
    component.loading = signal(false);
    component.error = signal('Erreur serveur');

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Erreur serveur');
  });
});
