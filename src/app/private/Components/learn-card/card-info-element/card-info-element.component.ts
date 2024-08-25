import { Component, EventEmitter, Input, Output } from '@angular/core';
import { finalPack } from '../../../../Shared/Interfaces/finalPack';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Timestamp } from '@angular/fire/firestore';
import { PopupService } from '../../../../Shared/Services/popup.service';
import { Dialog } from '../../../../Shared/Interfaces/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card-info-element',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './card-info-element.component.html',
  styleUrl: './card-info-element.component.scss',
})
export class CardInfoElementComponent {
  @Input() actualFinalPack?: finalPack;
  @Output() deleteEvent: EventEmitter<string> = new EventEmitter();

  constructor(private popupService: PopupService) {}

  changeDateFormat(date: Timestamp): string {
    let resultData: string = date.toDate().toLocaleDateString('hu-Hu', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    for (let i = 0; i < 2; i++) {
      resultData = resultData.replace(' ', '');
    }

    return resultData;
  }

  delete() {
    let dialog: Dialog = {
      title: 'Törlés',
      text: `Biztosan törölni szeretnéd a '${this.actualFinalPack?.title}' nevü paklit? `,
      color: 'primary',
      chose: true,
    };
    let dialogSub: Subscription = this.popupService
      .displayPopUp(dialog)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.deleteEvent.emit(this.actualFinalPack?.title);
          dialogSub.unsubscribe();
        } else {
          dialogSub.unsubscribe();
          return;
        }
      });
  }
}
