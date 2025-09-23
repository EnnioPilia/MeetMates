import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedTextComponent } from './shared-text.component';

describe('SharedTextComponent', () => {
  let component: SharedTextComponent;
  let fixture: ComponentFixture<SharedTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
