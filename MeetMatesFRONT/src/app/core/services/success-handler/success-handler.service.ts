import { Injectable, inject } from '@angular/core';
import { NotificationService } from '../notification/notification.service';
import { ApiResponse } from '../../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class SuccessHandlerService {
  private notification = inject(NotificationService);

  handle<T>(
    res: ApiResponse<T> | null | undefined,
    fallbackMessage?: string,
    options?: { silent?: boolean }
  ): void {
    if (!res || options?.silent) return;

    const backendMessage =
      res.message ||
      (res as any)?.msg ||
      (res as any)?.detail ||
      null;

    this.notification.showSuccess(
      backendMessage ??
      fallbackMessage ??
      '✔️ Opération effectuée avec succès.'
    );
  }
}
