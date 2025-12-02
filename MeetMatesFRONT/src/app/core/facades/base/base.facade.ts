import { signal } from '@angular/core';

export abstract class BaseFacade {

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
}
