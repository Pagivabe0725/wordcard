import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardInfoElementComponent } from './card-info-element/card-info-element.component';
import { CollectionService } from '../../../Shared/Services/collection.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { finalPack } from '../../../Shared/Interfaces/finalPack';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-learn-card',
  standalone: true,
  imports: [CardInfoElementComponent, MatProgressSpinner],
  templateUrl: './learn-card.component.html',
  styleUrl: './learn-card.component.scss',
})
export class LearnCardComponent implements OnInit, OnDestroy {
  public packArray: Array<finalPack> = [];
  private actrouteSub?: Subscription;
  public actualUser?: string;
  public loading: boolean = true;

  constructor(
    private collectionService: CollectionService,
    private actRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.actRoute.parent?.params.subscribe((params) => {
      this.actualUser = params['id'];
      let packSub: Subscription = this.collectionService
        .getDatasFromCollectionByName('Packs', this.actualUser, undefined)
        .subscribe((data: any) => {
          if (data) {
            let dataKeyArray: Array<string> = Object.keys(data);
            for (let key of dataKeyArray) {
              this.packArray?.push(data[key] as finalPack);
            }
          }
          console.log(this.packArray);
          this.loading = false;
          packSub.unsubscribe();
        });
    });
  }

  ngOnDestroy(): void {
    this.actrouteSub?.unsubscribe();
  }

  delete(title: string) {
    if (this.actualUser) {
      this.loading = true;
      this.collectionService
        .deletePackByTitle(this.actualUser, title)
        .then(() => {
          window.location.reload();
        })
        .catch((err) => console.error(err));
    }
  }
}
