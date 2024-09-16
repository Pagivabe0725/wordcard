import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { InfoBoardComponent } from './info-board/info-board.component';
import { RouterService } from '../../../Shared/Services/router.service';
import { Asteroid } from '../../../Shared/Interfaces/asteroid';
import { CommonModule } from '@angular/common';
import { InputElementComponent } from './input-element/input-element.component';
import { GetCardsService } from '../../Services/get-cards.service';
import { WordCard } from '../../../Shared/Interfaces/wordcard';
import { LocalStorageService } from '../../../Shared/Services/local-storage.service';
import { User } from '../../../Shared/Interfaces/user';
import { Subscription } from 'rxjs';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { PopupService } from '../../../Shared/Services/popup.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    InfoBoardComponent,
    CommonModule,
    InputElementComponent,
    MatProgressSpinner,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit, OnDestroy {
  private timeIntervall!: any;
  public loadedCardArray: boolean = false;
  private cardSub!: Subscription;
  public loading: boolean = true;
  public cardArray: Array<WordCard> = [];
  public actualIndex?: number;
  public copiedCardArray: Array<WordCard> = [];
  public hpArray: Array<boolean> = [];
  public gameField: Array<Array<Asteroid | string>> = [];
  public shipPosition?: number;
  public movingPoint: number = 5;
  private moving: boolean = true;
  private leaserCoordinateArray: Array<number> = [];
  private asteroidArray: Array<{ x: number; y: number }> = [];
  public gameTime: number = 0;
  public hittedFieldArray: Array<{
    y: number;
    x: number;
    destroyTime: number;
  }> = [];
  private smallAsteroid: Asteroid = {
    name: 'small',
    hp: 1,
    timer: 0,
    speed: 1,
  };
  private bigAsteroid: Asteroid = { name: 'big', hp: 2, timer: 0, speed: 4 };
  private redAsteroid: Asteroid = { name: 'red', hp: 3, timer: 0, speed: 6 };
  private newAsteroidsTimer: number = 10;
  constructor(
    private routerService: RouterService,
    private get_cardService: GetCardsService,
    private localStorageService: LocalStorageService,
    private popupService: PopupService
  ) {}

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (this.moving) {
      if (
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown' ||
        event.key === 'w' ||
        event.key === 's'
      ) {
        this.movingShip(event.key);
      } else if (event.code === 'Space') {
        if (this.movingPoint > 0) {
          this.shot();
          this.afterShot();
        }
      }
    }
  }

  ngOnInit(): void {
    this.cardSub = this.get_cardService
      .GetCards(
        'all',
        this.localStorageService.getOnePropertyOfObject('user', 'id')
      )
      .subscribe((data) => {
        console.log(data);
        this.cardArray = this.cardArray.concat(data.pack);
        this.copiedCardArray = [...this.cardArray];
      });
    setTimeout(() => {
      if (this.cardArray.length >= 20) {
        this.startSettings();
        this.loadedCardArray = true;
      } else {
        this.loading = false;
      }
    }, 3000);
  }

  ngOnDestroy(): void {
    this.cardSub.unsubscribe();
    clearInterval(this.timeIntervall!);
  }

  startSettings(): void {
    clearInterval(this.timeIntervall);
    this.asteroidArray = [];
    this.hittedFieldArray = [];
    this.movingPoint = 5;
    this.moving = true;
    this.setBasicField();
    this.difficultyLevel();
    this.setStartPositionOfShip();
    this.StarterAsteroids();
    //this.testAsteroids();
    this.actualIndex = this.randomNumberGenerator(this.cardArray.length);
    this.loading = false;
    this.game();
    if (!this.cardArray.length) {
      this.cardArray = [...this.copiedCardArray];
    }
  }

  game(): void {
    let game: any = setInterval(() => {
      console.log('a');
      this.decreaseHitValue();
      this.increaseAsteroidsTimer();
      this.moveAsteroid();
      this.newAsteroids();
      this.deleteAsteroidsOfHittedAreas();

      if (this.asteroidArray.length > 50 || this.stopGame()) {
        clearInterval(game);
        this.moving = false;
        this.popupService
          .displayPopUp({
            title: 'Vereség',
            text: 'Sajnos túl sok találatot kaptál! Szeretnéd újrakezdeni?',
            chose: true,
            color: 'accent',
          })
          .afterClosed()
          .subscribe((result) => {
            if (result) {
              this.startSettings();
            }
          });
      }
      this.gameTime++;
    }, 1000);
    this.timeIntervall = game;
  }

  choosenDifficulty(): string {
    return this.routerService
      .urlElement(this.routerService.numberOfSlide() - 1)
      .split('-')[0];
  }

  difficultyLevel(): void {
    const level: string = this.choosenDifficulty();
    switch (level) {
      case 'hard':
        this.setGameProperties(2, 3, 5, 6, 8);
        break;
      case 'mid':
        this.setGameProperties(3, 3, 6, 7, 8);
        break;
      case 'easy':
        this.setGameProperties(5, 4, 7, 8, 10);
        break;
      default:
        this.setHpArray(3);
        break;
    }
  }

  setGameProperties(
    hp: number,
    smallAsteroid: number,
    bigAsteroid: number,
    redAsteroid: number,
    newAsteroidTimer: number
  ): void {
    this.setHpArray(hp);
    this.smallAsteroid.speed = smallAsteroid;
    this.bigAsteroid.speed = bigAsteroid;
    this.redAsteroid.speed = redAsteroid;
    this.newAsteroidsTimer = newAsteroidTimer;
    console.log(this.newAsteroidsTimer);
  }

  setHpArray(piece: number): void {
    for (let i = 0; i < piece; i++) {
      this.hpArray.push(true);
    }
  }

  movingShip(direction: string) {
    if ((direction === 'w' || direction === 'ArrowUp') && this.movingPoint) {
      if (this.shipPosition! > 0) {
        this.gameField[this.shipPosition!][0] = '';
        this.gameField[this.shipPosition! - 1][0] = 'ship';
        this.shipPosition!--;
        this.movingPoint > 0 ? this.movingPoint-- : '';
      }
    } else if (
      (direction === 's' || direction === 'ArrowDown') &&
      this.movingPoint
    ) {
      if (this.shipPosition! < 5) {
        this.gameField[this.shipPosition!][0] = '';
        this.gameField[this.shipPosition! + 1][0] = 'ship';
        this.shipPosition!++;
        this.movingPoint > 0 ? this.movingPoint-- : '';
      }
    }
  }

  setBasicField(): void {
    this.gameField = [];
    for (let i = 0; i < 6; i++) {
      let helperArray = [];
      for (let j = 0; j < 10; j++) {
        helperArray.push('');
      }
      this.gameField.push(helperArray);
    }
  }

  setUnit(unit: Asteroid | string): string {
    if (typeof unit === 'string') {
      if (unit === 'ship') {
        return 'ship';
      } else if (unit === 'leaser') {
        return 'leaser';
      }
    } else {
      switch (unit.name) {
        case 'small':
          return 'small';
        case 'big':
          return 'big';
        case 'red':
          return 'red';
      }
    }
    return '';
  }

  shot(): void {
    if (typeof this.gameField[this.shipPosition!][1] === 'object') {
      this.decreaseHp(this.shipPosition!, 1);
    } else {
      for (let i = 1; i < 10; i++) {
        if (this.gameField[this.shipPosition!][i] == '') {
          this.gameField[this.shipPosition!][i] = 'leaser';
          this.leaserCoordinateArray.push(i);
        } else {
          this.decreaseHp(this.shipPosition!, i);
          break;
        }
      }
    }
  }

  randomNumberGenerator(max: number) {
    return Math.floor(Math.random() * max);
  }

  setStartPositionOfShip(): void {
    this.shipPosition = this.randomNumberGenerator(6);
    this.gameField[this.shipPosition][0] = 'ship';
  }

  afterShot() {
    this.moving = false;
    setTimeout(() => {
      this.deleteAllLeaserBeam();
      this.moving = true;
      this.movingPoint > 0 ? this.movingPoint-- : '';
    }, 50);
  }

  deleteAllLeaserBeam(): void {
    for (const coordinate of this.leaserCoordinateArray) {
      this.gameField[this.shipPosition!][coordinate] = '';
    }
    this.leaserCoordinateArray = [];
  }

  increaseMovingPoint(value: number) {
    this.movingPoint += value;
    if (value === 0) {
      setTimeout(() => {
        this.actualIndex = this.randomNumberGenerator(this.cardArray.length);
      }, 1500);
    } else {
      this.cardArray.splice(this.actualIndex!, 1);
      if (!this.cardArray.length) {
        this.cardArray = [...this.copiedCardArray];
      }
      this.actualIndex = this.randomNumberGenerator(this.cardArray.length);
    }
  }

  randomAsteroid(): Asteroid {
    const randomNumber: number = this.randomNumberGenerator(101);
    const smallest: number = 65;
    const mid: number = 95;
    let asteroid: Asteroid = { ...this.smallAsteroid };
    if (smallest < randomNumber && randomNumber <= mid) {
      asteroid = { ...this.bigAsteroid };
    } else if (randomNumber > mid) {
      asteroid = { ...this.redAsteroid };
    }
    return asteroid;
  }

  StarterAsteroids(): void {
    switch (this.choosenDifficulty()) {
      case 'easy':
        this.createAsteroids(3);
        break;
      case 'mid':
        this.createAsteroids(5);
        break;
      default:
        this.createAsteroids(7);
        break;
    }
  }

  newAsteroids(): void {
    if (this.gameTime % this.newAsteroidsTimer === 0 && this.gameTime > 0) {
      this.createAsteroids(this.randomNumberGenerator(5) + 1);
    }
  }

  createAsteroids(piece: number) {
    for (let i = 0; i < piece; i++) {
      const xCoordinate: number = 9 - this.randomNumberGenerator(3);
      const yCoordinate: number = this.randomNumberGenerator(6);
      if (this.gameField[yCoordinate][xCoordinate] === '') {
        this.gameField[yCoordinate][xCoordinate] = this.randomAsteroid();
        this.toAsteroidArray(xCoordinate, yCoordinate);
      } else {
        i--;
      }
    }
  }

  toAsteroidArray(x: number, y: number): void {
    const asteroidPosition: { x: number; y: number } = {
      x: x,
      y: y,
    };

    this.asteroidArray.push(asteroidPosition);
  }

  increaseAsteroidsTimer(): void {
    for (let i = 0; i < this.asteroidArray.length; i++) {
      (
        this.gameField[this.asteroidArray[i].y][
          this.asteroidArray[i].x
        ] as Asteroid
      ).timer++;
    }
  }

  moveAsteroid() {
    let asteroidsInOrder: Array<number> = Array.from(
      this.AllXPosition()
    ).sort();

    for (const i of asteroidsInOrder) {
      for (let j = 0; j < this.asteroidArray.length; j++) {
        const actualAsteroid: Asteroid = this.gameField[
          this.asteroidArray[j].y
        ][this.asteroidArray[j].x] as Asteroid;
        if (
          this.asteroidArray[j].x === i &&
          actualAsteroid.timer % actualAsteroid.speed === 0
        ) {
          const newPosition: { x: number; y: number } | undefined =
            this.movingAnalyse(
              this.asteroidArray[j].y,
              this.asteroidArray[j].x,
              j
            );
          if (newPosition) {
            this.gameField[this.asteroidArray[j].y][this.asteroidArray[j].x] =
              '';
            this.asteroidArray[j] = newPosition;
            this.gameField[newPosition.y][newPosition.x] = actualAsteroid;
          }
        }
      }
    }
  }

  AllXPosition(): Set<number> {
    let helperSet = new Set<number>();
    for (let i = 0; i < this.asteroidArray.length; i++) {
      helperSet.add(this.asteroidArray[i].x);
    }
    return helperSet;
  }

  movingAnalyse(
    actualY: number,
    actualX: number,
    index: number
  ): { y: number; x: number } | undefined {
    if (actualX >= 1 && this.gameField[actualY][actualX - 1] === '') {
      return { y: actualY, x: actualX - 1 };
    } else if (
      actualX >= 1 &&
      this.gameField[actualY][actualX - 1] === 'ship'
    ) {
      this.destroyAstreoid(actualY, actualX, index);
      this.hittedFieldArray.push({
        y: actualY,
        x: actualX - 1,
        destroyTime: this.gameTime + 2,
      });
      this.hpArray ? this.hpArray.splice(this.hpArray.length - 1, 1) : '';
      return undefined;
    } else if (actualX >= 1 && this.gameField[actualY][actualX - 1] !== '') {
      const actualAsteroid: Asteroid = this.gameField[actualY][
        actualX
      ] as Asteroid;
      switch (actualAsteroid.name) {
        case 'small':
          if (
            actualY + 1 <= 5 &&
            actualY - 1 >= 0 &&
            this.gameField[actualY - 1][actualX - 1] === '' &&
            this.gameField[actualY + 1][actualX - 1] === ''
          ) {
            const randomDirection = this.randomNumberGenerator(2);
            return randomDirection
              ? this.asteroidDown(actualY, actualX)
              : this.asteroidUp(actualY, actualX);
          } else if (
            actualY === 0 &&
            this.gameField[actualY + 1][actualX - 1] === ''
          ) {
            return this.asteroidDown(actualY, actualX);
          } else if (
            actualY === 5 &&
            this.gameField[actualY - 1][actualX - 1] === ''
          ) {
            return this.asteroidUp(actualY, actualX);
          } else if (
            actualY + 1 <= 5 &&
            actualY - 1 >= 0 &&
            this.gameField[actualY - 1][actualX - 1] === '' &&
            this.gameField[actualY + 1][actualX - 1] !== ''
          ) {
            return this.asteroidUp(actualY, actualX);
          } else if (
            actualY + 1 <= 5 &&
            actualY - 1 >= 0 &&
            this.gameField[actualY - 1][actualX - 1] !== '' &&
            this.gameField[actualY + 1][actualX - 1] === ''
          ) {
            return this.asteroidDown(actualY, actualX);
          } else {
            break;
          }

        case 'big':
          if (
            actualX >= 1 &&
            typeof this.gameField[actualY][actualX - 1] === 'object'
          ) {
            const inFrontOfThis: Asteroid = this.gameField[actualY][
              actualX - 1
            ] as Asteroid;
            if (inFrontOfThis.name === 'red') {
              this.gameField[actualY][actualX] = { ...this.redAsteroid };
            }
            return undefined;
          }
      }
    }

    return { y: actualY, x: actualX };
  }

  asteroidDown(actualY: number, actualX: number) {
    return { y: actualY + 1, x: actualX - 1 };
  }

  asteroidUp(actualY: number, actualX: number) {
    return { y: actualY - 1, x: actualX - 1 };
  }

  decreaseHp(y: number, x: number): void {
    for (let i = 0; i < this.asteroidArray.length; i++) {
      if (this.asteroidArray[i].x === x && this.asteroidArray[i].y === y) {
        (this.gameField[y][x] as Asteroid).hp--;
        (this.gameField[y][x] as Asteroid).hp === 0
          ? this.destroyAstreoid(y, x, i)
          : '';
        break;
      }
    }
  }

  destroyAstreoid(y: number, x: number, index: number): void {
    this.asteroidArray.splice(index, 1);
    this.gameField[y][x] = '';
  }

  testAsteroids() {
    {
      ///Asteroids
      this.gameField[0][2] = { ...this.smallAsteroid };
      this.gameField[1][3] = { ...this.smallAsteroid };
    }
    for (let i = 0; i < this.gameField.length; i++) {
      for (let j = 0; j < this.gameField[i].length; j++) {
        if (typeof this.gameField[i][j] === 'object') {
          this.asteroidArray.push({ x: j, y: i });
        }
      }
    }
  }

  searchGoodPossitions(): Array<number> {
    let helperArray: Array<number> = [];
    for (let i = 0; i < this.asteroidArray.length; i++) {
      if (this.asteroidArray[i].x === 0) {
        helperArray.push(i);
      }
    }
    return helperArray;
  }

  deleteAsteroidsOfHittedAreas(): void {
    while (this.searchGoodPossitions().length > 0) {
      const helper: Array<number> = this.searchGoodPossitions();
      this.hittedFieldArray.push({
        x: this.asteroidArray[helper[0]].x,
        y: this.asteroidArray[helper[0]].y,
        destroyTime: this.gameTime + 5,
      });
      this.destroyAstreoid(
        this.asteroidArray[helper[0]].y,
        this.asteroidArray[helper[0]].x,
        helper[0]
      );
      this.hpArray.splice(this.hpArray.length - 1, 1);
    }
  }

  stopGame(): boolean {
    if (this.hpArray.length === 0) {
      return true;
    }
    return false;
  }

  getHittedFieldValue(yCoordinate: number, xCoordinate: number): boolean {
    for (let i of this.hittedFieldArray) {
      if (i.x === xCoordinate && i.y === yCoordinate && this.hittedFieldArray) {
        return true;
      }
    }
    return false;
  }

  decreaseHitValue(): void {
    let helperArray: Array<number> = [];
    for (let i = 0; i < this.hittedFieldArray.length; i++) {
      if (this.hittedFieldArray[i].destroyTime === this.gameTime) {
        helperArray.push(i);
      }
    }
    for (let i = 0; i < helperArray.length; i++) {
      this.hittedFieldArray.splice(0, 1);
    }
  }
}
