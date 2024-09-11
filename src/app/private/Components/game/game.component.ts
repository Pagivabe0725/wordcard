import { Component, HostListener, OnInit } from '@angular/core';
import { InfoBoardComponent } from './info-board/info-board.component';
import { RouterService } from '../../../Shared/Services/router.service';
import { Asteroid } from '../../../Shared/Interfaces/asteroid';
import { CommonModule } from '@angular/common';
import { InputElementComponent } from './input-element/input-element.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [InfoBoardComponent, CommonModule, InputElementComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent implements OnInit {
  public hpArray: Array<boolean> = [];
  public gameField: Array<Array<Asteroid | string>> = [];
  public shipPosition?: number;
  public movingPoint: number = 3;
  private moving: boolean = true;
  private leaserCoordinateArray: Array<number> = [];
  private asteroidArray: Array<{ x: number; y: number }> = [];
  public gameTime: number = 0;
  private smallAsteroid: Asteroid = {
    name: 'small',
    hp: 1,
    timer: 0,
    speed: 1,
  };
  private bigAsteroid: Asteroid = { name: 'big', hp: 2, timer: 0, speed: 2 };
  private redAsteroid: Asteroid = { name: 'red', hp: 3, timer: 0, speed: 3 };
  private newAsteroidsTimer: number = 10;
  constructor(private routerService: RouterService) {}

  ngOnInit(): void {
    this.difficultyLevel();
    this.setBasicField();
    this.setStartPositionOfShip();
    this.StarterAsteroids();
    //sthis.testAsteroids()
    this.game();
  }

  game(): void {
    let game = setInterval(() => {
      this.gameTime++;
      this.increaseAsteroidsTimer();
      this.newAsteroids();
      this.moveAsteroid();
      if (this.asteroidArray.length > 50 || this.stopGame()) {
        clearInterval(game);
      }
    }, 1000);
  }

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

  choosenDifficulty(): string {
    return this.routerService
      .urlElement(this.routerService.numberOfSlide() - 1)
      .split('-')[0];
  }

  difficultyLevel(): void {
    const level: string = this.choosenDifficulty();
    switch (level) {
      case 'hard':
        this.setGameProperties(2, 2, 4, 5, 8);
        break;
      case 'mid':
        this.setGameProperties(3, 3, 4, 5, 8);
        break;
      case 'easy':
        this.setGameProperties(5, 3, 5, 6, 10);
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
      this.createAsteroids(this.randomNumberGenerator(7) + 1);
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

    for (let i = 0; i < asteroidsInOrder.length; i++) {
      for (let j = 0; j < this.asteroidArray.length; j++) {
        if (this.asteroidArray[j].x === asteroidsInOrder[i]) {
          if (this.asteroidArray[j].x > 0) {
            if (
              (
                this.gameField[this.asteroidArray[j].y][
                  this.asteroidArray[j].x
                ] as Asteroid
              ).timer %
                (
                  this.gameField[this.asteroidArray[j].y][
                    this.asteroidArray[j].x
                  ] as Asteroid
                ).speed ===
              0
            ) {
              const actualAsteroid: Asteroid = this.gameField[
                this.asteroidArray[j].y
              ][this.asteroidArray[j].x] as Asteroid;
              const newPositions: { x: number; y: number } | undefined =
                this.movingAnalyse(
                  this.asteroidArray[j].y,
                  this.asteroidArray[j].x,
                  j
                );
              if (newPositions !== undefined) {
                this.gameField[this.asteroidArray[j].y][
                  this.asteroidArray[j].x
                ] = '';
                this.gameField[newPositions.y][newPositions.x] = actualAsteroid;
                this.asteroidArray[j] = newPositions;
              }
            }
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
    if (this.gameField[actualY][actualX - 1] === '' && actualX - 1 !== 0) {
      this.asteroidArray[index] = { y: actualY, x: actualX - 1 };
      this.gameField[actualY][actualX] = '';
      return { y: actualY, x: actualX - 1 };
    } else if (
      this.gameField[actualY][actualX - 1] === 'ship' ||
      actualX - 1 === 0
    ) {
      if (this.hpArray) {
        this.hpArray.splice(this.hpArray.length - 1);
        this.destroyAstreoid(actualY, actualX, index);
        return undefined;
      }
    } else {
      const actualAsteroidName: string = (
        this.gameField[actualY][actualX] as Asteroid
      ).name;
      switch (actualAsteroidName) {
        case 'small':
          if (
            actualY + 1 <= 5 &&
            actualY - 1 >= 0 &&
            this.gameField[actualY - 1][actualX - 1] === '' &&
            this.gameField[actualY + 1][actualX - 1] === ''
          ) {
            const direction: number = this.randomNumberGenerator(2);
            if (direction) {
              return this.asteroidDown(actualY, actualX);
            } else {
              return this.asteroidUp(actualY, actualX);
            }
          } else {
            if (
              actualY - 1 >= 0 &&
              this.gameField[actualY - 1][actualX - 1] === ''
            ) {
              return this.asteroidUp(actualY, actualX);
            } else if (
              actualY + 1 <= 5 &&
              this.gameField[actualY + 1][actualX - 1] === ''
            ) {
              return this.asteroidDown(actualY, actualX);
            } else {
              return { y: actualY, x: actualX };
            }
          }

        case 'big':
          if (
            actualX > 0 &&
            typeof this.gameField[actualY][actualX - 1] === 'object' &&
            (this.gameField[actualY][actualX - 1] as Asteroid).name === 'red'
          ) {
            this.gameField[actualY][actualX] = { ...this.redAsteroid };
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
        this.destroyAstreoid(y, x, i);
        break;
      }
    }
  }

  destroyAstreoid(y: number, x: number, index: number): void {
    console.log(this.gameField[y][x] as Asteroid);
    if ((this.gameField[y][x] as Asteroid).hp <= 0) {
      this.gameField[y][x] = '';
      this.asteroidArray.splice(index, 1);
    }
  }

  testAsteroids() {
    {
      ///Asteroids
      this.gameField[1][7] = { ...this.bigAsteroid };
      this.gameField[1][8] = { ...this.smallAsteroid };
    }

    for (let i = 0; i < this.gameField.length; i++) {
      for (let j = 0; j < this.gameField[i].length; j++) {
        if (typeof this.gameField[i][j] === 'object') {
          this.asteroidArray.push({ x: j, y: i });
        }
      }
    }
  }

  stopGame(): boolean {
    if (this.hpArray.length === 0) {
      return true;
    }
    return false;
  }
}
