import { Component, HostListener, OnInit } from '@angular/core';
import { InfoBoardComponent } from './info-board/info-board.component';
import { RouterService } from '../../../Shared/Services/router.service';
import { Asteroid } from '../../../Shared/Interfaces/asteroid';
import { CommonModule } from '@angular/common';
import { InputElementComponent } from './input-element/input-element.component';

const smallAsteroid:Asteroid={name:'small',hp:1,timer:0,speed:2}
const bigAsteroid:Asteroid={name:'big',hp:2,timer:0,speed:4}
const redAsteroid:Asteroid={name:'red',hp:3,timer:0,speed:6}

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
  constructor(private routerService: RouterService) {}

  ngOnInit(): void {
    this.dificultyLevel();
    this.setBasicField();
    this.setStartPositionOfShip();
    this.StarterAsteroids();
    this.game();
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

  dificultyLevel() {
    const level: string = this.routerService
      .urlElement(this.routerService.numberOfSlide() - 1)
      .split('-')[0];

    switch (level) {
      case 'hard':
        this.setHpArray(2);
        break;
      case 'mid':
        this.setHpArray(3);
        break;
      case 'easy':
        this.setHpArray(5);
        break;
      default:
        this.setHpArray(3);
        break;
    }
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

  game(): void {
    setInterval(() => {
      this.gameTime++;
      this.increaseAsteroidsTimer();
      this.moveAsteroid();
    }, 1000);
  }

  increaseMovingPoint(value: number) {
    this.movingPoint += value;
  }

  randomAsteroid(): Asteroid {
    const randomNumber: number = this.randomNumberGenerator(101);
    const smallest: number = 65;
    const mid: number = 95;
    let asteroid: Asteroid = { ...smallAsteroid};
    if (smallest < randomNumber && randomNumber <= mid) {
      asteroid = { ...bigAsteroid };
    } else if (randomNumber > mid) {
      asteroid = {...redAsteroid};
    }
    return asteroid;
  }

  StarterAsteroids(): void {
    let pieceOfStarterAsteroids: number;
    switch (this.hpArray.length) {
      case 5:
        pieceOfStarterAsteroids = 3;
        break;
      case 3:
        pieceOfStarterAsteroids = 5;
        break;
      default:
        pieceOfStarterAsteroids = 7;
        break;
    }

    for (let i = 0; i < pieceOfStarterAsteroids; i++) {
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
    for (let i = 0; i < this.asteroidArray.length; i++) {
      const actualAsteroid: Asteroid = this.gameField[this.asteroidArray[i].y][
        this.asteroidArray[i].x
      ] as Asteroid;
      if (actualAsteroid.timer % actualAsteroid.speed === 0) {
        if (this.asteroidArray[i].x > 0) {
          this.gameField[this.asteroidArray[i].y][this.asteroidArray[i].x] = '';
          this.gameField[this.asteroidArray[i].y][this.asteroidArray[i].x - 1] =
            actualAsteroid;
          this.asteroidArray[i].x--;
        }
      }
    }
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
}
