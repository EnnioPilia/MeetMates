import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTitleComponent } from './shared-title.component';

describe('SharedTitleComponent', () => {
  let component: SharedTitleComponent;
  let fixture: ComponentFixture<SharedTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
