import { inject, Injectable } from '@angular/core';
import { MessageService, ToastMessageOptions } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
   readonly #messageService = inject(MessageService);

  showSuccess(message: string, summary = 'Success'): void {
    this.#messageService.add({ severity: 'success', summary, detail: message });
  }

  showError(message: Partial<ToastMessageOptions>): void {
    this.#messageService.add({
        severity: 'error',
        summary: 'Error',
        sticky: true,
        life: 5000,
         ...message,
      });
  }

  showInfo(message: string, summary = 'Info'): void {
    this.#messageService.add({ severity: 'info', summary, detail: message });
  }

  showWarning(message: string, summary = 'Warning'): void {
    this.#messageService.add({ severity: 'warn', summary, detail: message });
  }

  constructor() { }

}
