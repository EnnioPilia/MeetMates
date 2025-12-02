import { Component, Input, Signal } from '@angular/core';
import { LoadingSpinnerComponent } from '../loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-state-handler',
  standalone: true,
  imports: [ LoadingSpinnerComponent],
  templateUrl: './state-handler.component.html'
})

export class StateHandlerComponent {
  @Input() loading!: Signal<boolean>;
  @Input() error!: Signal<string | null>;
}
