import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventFormComponent } from './event-form.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../core/services/notification/notification.service';
import { EventFormValue, EventFormMode } from '../../core/models/event-form.model';
import { AddressSuggestion } from '../../core/services/address/address.service';
import { Activity } from '../../core/models/activity.model';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('EventFormComponent', () => {
  let component: EventFormComponent;
  let fixture: ComponentFixture<EventFormComponent>;
  let notification: jasmine.SpyObj<NotificationService>;

  const mockActivities: Activity[] = [
    { id: '1', name: 'Football', categoryId: 'cat1' },
    { id: '2', name: 'Basketball', categoryId: 'cat1' }
  ];

  const mockAddress: AddressSuggestion = {
    label: '1 Rue de Paris, 75001 Paris',
    street: '1 Rue de Paris',
    city: 'Paris',
    postalCode: '75001'
  };

  beforeEach(async () => {
    notification = jasmine.createSpyObj('NotificationService', ['showWarning']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EventFormComponent],
      providers: [
        { provide: NotificationService, useValue: notification },
        FormBuilder,
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null } }, params: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventFormComponent);
    component = fixture.componentInstance;
    component.mode = 'create';
    component.activities = mockActivities;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build a valid form on init', () => {
    component.ngOnInit();
    expect(component.form).toBeTruthy();
    expect(component.form.controls['title']).toBeDefined();
    expect(component.form.controls['address']).toBeDefined();
    expect(component.form.valid).toBeFalse(); 
  });

  it('should emit submitForm when form is valid', () => {
    component.ngOnInit();
    component.form.patchValue({
      title: 'Test Event',
      description: 'Description',
      eventDate: new Date(),
      startTime: '10:00',
      endTime: '12:00',
      maxParticipants: 5,
      material: 'Ball',
      level: 'Beginner',
      activityId: '1',
      address: { street: '1 Rue de Paris', city: 'Paris', postalCode: '75001' },
      addressLabel: '1 Rue de Paris, 75001 Paris'
    });

    spyOn(component.submitForm, 'emit');

    component.onSubmit();

    expect(component.submitForm.emit).toHaveBeenCalledWith(component.form.value);
    expect(notification.showWarning).not.toHaveBeenCalled();
  });

  it('should show warning if form is invalid', () => {
    component.ngOnInit();
    component.form.patchValue({ title: '' }); 

    component.onSubmit();

    expect(notification.showWarning).toHaveBeenCalledWith(
      'Veuillez remplir tous les champs correctement.'
    );
  });

  it('should emit addressInput on onAddressInput', () => {
    spyOn(component.addressInput, 'emit');
    component.onAddressInput('Paris');
    expect(component.addressInput.emit).toHaveBeenCalledWith('Paris');
  });

  it('should emit addressSelected on onAddressSelect', () => {
    spyOn(component.addressSelected, 'emit');
    component.onAddressSelect(mockAddress);
    expect(component.addressSelected.emit).toHaveBeenCalledWith(mockAddress);
  });

  it('should prefill form in edit mode', () => {
    const initialData: Partial<EventFormValue> = {
      title: 'Event Edit',
      address: { street: '1 Rue de Paris', city: 'Paris', postalCode: '75001' }
    };
    component.mode = 'edit';
    component.initialData = initialData;

    component.ngOnInit();

    expect(component.form.value.title).toBe('Event Edit');
    expect(component.form.get('addressLabel')?.value).toBe('1 Rue de Paris, 75001 Paris');
  });
});
