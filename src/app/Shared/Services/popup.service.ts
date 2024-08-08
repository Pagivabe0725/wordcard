import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../Components/popup/popup.component';
import { Dialog } from '../Interfaces/dialog';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  constructor(private matDialog: MatDialog) {}

  displayPopUp(dialog: Dialog) {
    return this.matDialog.open(PopupComponent, {
      width: '50%',
      height: '50%',
      data: dialog as Dialog,
    });
  }
}
