import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberInTime',
  standalone: true,
})
export class NumberInTimePipe implements PipeTransform {
  transform(value: number): string {
    const h: number = Math.floor(value / 3600);
    const m: number = Math.floor((value % 3600) / 60);
    const s: number = value % 60;

    let result: string = [
      h.toString().padStart(2, '0'),
      m.toString().padStart(2, '0'),
      s.toString().padStart(2, '0'),
    ].join(':');
    return result;
  }
}
