import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CollectionService } from '../../../../Shared/Services/collection.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { PopupService } from '../../../../Shared/Services/popup.service';
import { Dialog } from '../../../../Shared/Interfaces/dialog';

@Component({
  selector: 'app-title',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, ReactiveFormsModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss',
})
export class TitleComponent implements OnInit, OnDestroy {
  @Input() inputTitle!: FormControl;
  @Output() saveEvent: EventEmitter<string> = new EventEmitter();
  private allTitleArray?: Array<string>;
  private categorySub?: Subscription;

  constructor(
    private actRoute: ActivatedRoute,
    private collectionService: CollectionService,
    private popupService: PopupService
  ) {}

  ngOnInit(): void {
    this.categorySub = this.actRoute.parent?.params.subscribe((params) => {
      let collectionSub: Subscription = this.collectionService
        .getDatasFromCollectionByName('Packs', params['id'], undefined)
        .subscribe((data) => {
          if (data) this.allTitleArray = Object.keys(data);
          console.log(this.allTitleArray);
          collectionSub.unsubscribe();
        });
    });
    this.inputTitle.addValidators([
      Validators.required,
      Validators.minLength(2),
    ]);
  }

  ngOnDestroy(): void {
    this.categorySub?.unsubscribe();
  }

  getFormValue(): string {
    if (this.inputTitle) {
      if (this.inputTitle.value === 'CurrentPack') {
        this.inputTitle.setValue('')
        return '';
      } else {
        return this.inputTitle.value;
      }
    }
    return '';
  }

  titleAlreadyExist(): boolean {
    if (this.allTitleArray) {
      return this.allTitleArray?.includes(this.inputTitle.value);
    }
    return false;
  }

  popUpContent(): Dialog {
    let dialog: Dialog = {
      title: '',
      text: '',
      color: 'accent',
      chose: true,
    };
    if (this.titleAlreadyExist()) {
      dialog.text =
        'A megadott cím már létezik, szeretnéd fellülírni a már létező paklit?';
      dialog.title = 'A cím már létezik!';
    } else {
      dialog.text =
        'A megadott cím megfelel. Biztosan ezzel a címmel szeretnéd létrehozni a Paklit?';
      dialog.title = 'Megfelelő cím!';
    }

    return dialog;
  }

  saveFunction(): void {
    if (this.inputTitle.valid) {
      this.popupService
        .displayPopUp(this.popUpContent())
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.saveEvent.emit(this.inputTitle.value);
          } else {
            return;
          }
        });
    }
  }
}
