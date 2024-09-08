import { Component, EventEmitter, Input, Output } from '@angular/core';
import { finalPack } from '../../../../Shared/Interfaces/finalPack';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Timestamp } from '@angular/fire/firestore';
import { PopupService } from '../../../../Shared/Services/popup.service';
import { Dialog } from '../../../../Shared/Interfaces/dialog';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-card-info-element',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  templateUrl: './card-info-element.component.html',
  styleUrl: './card-info-element.component.scss',
})
export class CardInfoElementComponent {
  @Input() actualFinalPack?: finalPack;
  @Input() isAOption: boolean = false;
  @Output() deleteEvent: EventEmitter<string> = new EventEmitter();
  @Input() public active: boolean = false;
  @Output() private changeActivityEvent: EventEmitter<{
    title: string;
    action: 'add' | 'delete';
  }> = new EventEmitter();
  @Output() loadingEvent: EventEmitter<void> = new EventEmitter();
  @Output() navigateEvent: EventEmitter<string> = new EventEmitter();

  constructor(
    private popupService: PopupService,
  ) {}

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

  change() {
    let dialog: Dialog = {
      title: 'Módosítás',
      text: `Biztosan Módosítani szeretnéd a '${this.actualFinalPack?.title}' nevü paklit? `,
      color: 'primary',
      chose: true,
    };

    let dialogSub: Subscription = this.popupService
      .displayPopUp(dialog)
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.navigateEvent.emit(this.actualFinalPack!.title);
          dialogSub.unsubscribe();
        } else {
          dialogSub.unsubscribe();
          return;
        }
      });
  }

  changeSlideToggelStatus(): void {
    const action: 'add' | 'delete' = this.active ? 'delete' : 'add';
    this.changeActivityEvent.emit({
      title: this.actualFinalPack!.title,
      action,
    });
  }

  loadSinglePack() {
    this.changeActivityEvent.emit({
      title: this.actualFinalPack!.title,
      action: 'add',
    });
    this.loadingEvent.emit();
  }
}
