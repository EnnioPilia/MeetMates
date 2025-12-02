import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EditEventFacade } from '../../core/facades/event/edit-event.facade';
import { EditEventInfoComponent } from './components/edit-event-info.component';
import { EditEventDetailsComponent } from './components/edit-event-details.component';
import { EditEventAddressComponent } from './components/edit-event-address.component';
import { EditEventDateTimeComponent } from './components/edit-event-dateTime.component';
import { EditEventActivityComponent } from './components/edit-event-activity.component';
import { AppButtonComponent } from '../../shared-components/button/button.component';
import { StateHandlerComponent } from '../../shared-components/state-handler/state-handler.component';

@Component({
  selector: 'app-edit-event',
  standalone: true,
imports: [
  EditEventInfoComponent,
  EditEventDetailsComponent,
  EditEventAddressComponent,
  EditEventDateTimeComponent,
  EditEventActivityComponent,
  AppButtonComponent,
  StateHandlerComponent
],
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss']
})
export class EditEventComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private editEventFacade = inject(EditEventFacade);
  private destroyRef = inject(DestroyRef);

  readonly loading = this.editEventFacade.loading;
  readonly error = this.editEventFacade.error;
  readonly activities = this.editEventFacade.activities;
  readonly event = this.editEventFacade.event;
  readonly addressSuggestions = this.editEventFacade.addressSuggestions;

  form!: FormGroup;
  eventId!: string;

  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const id = params.get('id');
        if (!id) return;
        this.eventId = id;

        this.editEventFacade.loadEvent(id).subscribe({
          next: () => this.initForm(),
          error: () => {}
        });
      });
  }

  initForm() {
    const e = this.event();
    if (!e) return;

    this.form = this.fb.group({
      title: [e.title],
      description: [e.description],
      activityName: [e.activityName],
      activityId: [null],
      level: [e.level],
      maxParticipants: [e.maxParticipants],
      material: [e.material],
      eventDate: [e.eventDate],
      startTime: [e.startTime],
      endTime: [e.endTime],
      addressLabel: [e.addressLabel],
      status: [e.status]
    });
  }

  saveChanges() {
    if (!this.form.valid) return;

    const updated = {
      ...this.event()!,
      ...this.form.value
    };

    this.editEventFacade.updateEvent(this.eventId, updated).subscribe(() => {
      this.router.navigate(['/profile']);
    });
  }

  onAddressInput(query: string) {
    if (!query) return;
    this.editEventFacade.getAddressSuggestions(query).subscribe();
  }
}
