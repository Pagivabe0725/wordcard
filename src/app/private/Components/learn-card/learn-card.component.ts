import { Component, OnDestroy, OnInit } from '@angular/core';
import { CardInfoElementComponent } from './card-info-element/card-info-element.component';
import { CollectionService } from '../../../Shared/Services/collection.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { finalPack } from '../../../Shared/Interfaces/finalPack';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { OrderServiceService } from '../../../Shared/Services/order-service.service';
import { RouterService } from '../../../Shared/Services/router.service';
import { LocalStorageService } from '../../../Shared/Services/local-storage.service';

@Component({
  selector: 'app-learn-card',
  standalone: true,
  imports: [
    CardInfoElementComponent,
    MatProgressSpinner,
    MatMenuModule,
    MatButtonModule,
  ],
  templateUrl: './learn-card.component.html',
  styleUrl: './learn-card.component.scss',
})
export class LearnCardComponent implements OnInit, OnDestroy {
  public packArray: Array<finalPack> = [];
  public actualUser?: string;
  public loading: boolean = true;
  public moreOption: boolean = false;
  public activeOptinsArray: Array<string> = [];
  private packSub?: Subscription;
  private orderType?: 'string' | 'Timestamp' = 'string';
  private orderDirection: 'increase' | 'decrease' = 'increase';

  constructor(
    private collectionService: CollectionService,
    private actRoute: ActivatedRoute,
    private orderService: OrderServiceService,
    private routerService: RouterService,
    private localStroageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    console.log('henlo')
    this.actualUser = this.localStroageService.getOnePropertyOfObject(
      'user',
      'id'
    );
    this.packSub = this.collectionService
      .getDatasFromCollectionByName('Packs', this.actualUser, undefined)
      .subscribe((data: any) => {
        if (data) {
          this.packArray = [];
          let dataKeyArray: Array<string> = Object.keys(data);
          for (let key of dataKeyArray) {
            this.packArray?.push(data[key] as finalPack);
          }
        }
        this.orderFunction();
        this.loading = false;
      });
  }

  ngOnDestroy(): void {
    this.packSub?.unsubscribe();
  }

  delete(title: string): void {
    if (this.actualUser) {
      this.loading = true;
      this.collectionService
        .deletePackByTitle(this.actualUser, title)
        .then(() => {
          console.log(this.packArray);
        })
        .catch((err) => console.error(err));
    }
  }

  setOrderType(type: 'string' | 'Timestamp'): void {
    this.orderType = type;
    this.orderFunction();
  }

  changeDirection(): void {
    this.orderDirection =
      this.orderDirection === 'increase' ? 'decrease' : 'increase';
    this.orderFunction();
  }

  translateDirection(): boolean {
    return this.orderDirection === 'increase';
  }
  changeOptionNumber(): void {
    this.moreOption = this.moreOption ? false : true;
    if (!this.moreOption) {
      this.activeOptinsArray = [];
    }
  }

  orderFunction(): void {
    this.loading = true;
    (this.orderType === 'string'
      ? this.orderService.orderString(this.packArray, this.translateDirection())
      : this.orderService.orderTimestamp(
          this.packArray,
          this.translateDirection()
        )
    )
      .then((result) => {
        this.packArray = result;
      })
      .catch((err) => console.error(err))
      .finally(() => (this.loading = false));
  }

  activeOptionsArrayManipulate(setup: {
    title: string;
    action: 'add' | 'delete';
  }): void {
    if (setup.action === 'delete') {
      this.activeOptinsArray.splice(
        this.activeOptinsArray.indexOf(setup.title),
        1
      );
    } else if (setup.action === 'add') {
      this.activeOptinsArray.push(setup.title);
    }
  }

  isActiveElement(index: number): boolean {
    return this.activeOptinsArray.includes(this.packArray[index].title);
  }

  loadingPackOrPacks(): void {
    this.routerService.navigate(
      `private/${this.actualUser}/learn-card/${this.activeOptinsArray}`
    );
  }

  navigateToModificationPage(path: string) {
    this.routerService.navigate(
      `private/${this.actualUser}/create-card/${path}`
    );
  }
}
