import { Timestamp } from '@angular/fire/firestore';
import { WordCard } from './wordcard';

export interface finalPack {
  changed: boolean;
  date: Timestamp;
  pack: Array<WordCard>;
  length: number;
  title: string;
}
