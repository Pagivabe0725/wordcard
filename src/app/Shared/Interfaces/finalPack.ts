import { WordCard } from './wordcard';

export interface finalPack {
  changed: boolean;
  date: Date;
  pack: Array<WordCard>;
  length: number;
  title: string;
}
