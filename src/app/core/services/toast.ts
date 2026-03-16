import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  currentToast = signal<ToastMessage | null>(null);

  show(message: string, type: ToastType = 'info') {
    this.currentToast.set({ message, type });

    setTimeout(() => {
      this.hide();
    }, 3000);
  }

  hide() {
    this.currentToast.set(null);
  }
}
