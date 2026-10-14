import { Injectable, inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private ngxSpinner = inject(NgxSpinnerService);

  show(): void {
    this.ngxSpinner.show();
  }

  hide(): void {
    this.ngxSpinner.hide();
  }
}
