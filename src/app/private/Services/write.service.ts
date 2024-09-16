import { Injectable } from '@angular/core';
import { WordCard } from '../../Shared/Interfaces/wordcard';
import { WriteHelper } from '../../Shared/Interfaces/writeHelper';

@Injectable({
  providedIn: 'root',
})
export class WriteService {
  constructor() {}

  createValuesOfActualCardAndFillableArray(
    text: WordCard,
    side: 'hungarian' | 'english'
  ): Array<Array<string>> {
    let resultArray: Array<Array<string>> = [];
    let createValuesOfActualCard: Array<string> = [];
    let fillableArray: Array<string> = [];
    for (const position of side === 'english' ? text.hungarian : text.english) {
      createValuesOfActualCard.push(position);
      fillableArray.push(' ');
    }
    resultArray.push(createValuesOfActualCard);
    resultArray.push(fillableArray);
    return resultArray;
  }

  plusHelper(obj: WriteHelper): WriteHelper {
    while (
      (obj.fillableArray[obj.workIndex] !== ' ' ||
        obj.actualCardArray[obj.workIndex] === ' ') &&
      obj.workIndex !== obj.actualCardArray.length - 1
    ) {
      obj.workIndex++;
      console.log(obj.workIndex);
    }
    return obj;
  }

  plus(obj: WriteHelper, key: string): WriteHelper {
    obj = this.plusHelper(obj);
    if (obj.fillableArray[obj.workIndex] === ' ') {
      obj.fillableArray[obj.workIndex] = key;
    }
    return obj;
  }

  minusHelper(obj: WriteHelper): WriteHelper {
    if (this.isExistFilledElement(obj.fillableArray)) {
      while (obj.fillableArray[obj.workIndex] === ' ') {
        obj.workIndex--;
        if (!obj.workIndex) break;
      }
    }
    return obj;
  }

  isExistFilledElement(array: Array<string>): boolean {
    for (let i = 0; i < array.length; i++) {
      if (array[i] !== ' ') {
        return true;
      }
    }
    return false;
  }

  minus(obj: WriteHelper): WriteHelper {
    if (
      obj.actualCardArray[obj.workIndex] === ' ' ||
      obj.fillableArray[obj.workIndex] === ' '
    ) {
      obj = this.minusHelper(obj);
      obj.fillableArray[obj.workIndex] = ' ';
    } else {
      obj.fillableArray[obj.workIndex] = ' ';
      obj.workIndex > 0 ? obj.workIndex-- : ' ';
    }
    return obj;
  }

  compareArraysValues(obj: WriteHelper): WriteHelper {
    obj.result = true;
    obj.fillable = false;
    for (let i = 0; i < obj.actualCardArray.length; i++) {
      if (
        obj.actualCardArray[i].toLowerCase() !==
        obj.fillableArray[i].toLowerCase()
      ) {
        obj.result = false;
        break;
      }
    }
    return obj;
  }

  isFilled(obj: WriteHelper): boolean {
    for (let i = 0; i < obj.actualCardArray.length; i++) {
      if (obj.fillableArray[i] === ' ' && obj.actualCardArray[i] !== ' ') {
        return false;
      }
    }
    return true;
  }
}
