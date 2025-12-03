import { signal, inject } from '@angular/core';
import { catchError, of, Observable } from 'rxjs';
import { ErrorHandlerService } from '../../services/error-handler/error-handler.service';

export abstract class BaseFacade {
  private errorHandler = inject(ErrorHandlerService);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  protected startLoading() {
    this.loading.set(true);
    this.error.set(null);
  }

  protected stopLoading() {
    this.loading.set(false);
  }

  protected setError(message: string) {
    this.error.set(message);
  }

  protected handleError<T>(message?: string, onFinally?: () => void) {
    return (source: Observable<T>) =>
      source.pipe(
        catchError(err => {
          this.errorHandler.handle(err);

          if (message) {
            this.setError(message);
          }

          this.stopLoading();

          if (typeof (this as any).stop === 'function') {
            (this as any).stop();
          }

          if (onFinally) {
            onFinally();
          }

          return of(null as T);
        })
      );
  }

}
