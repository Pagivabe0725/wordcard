import { WordCard } from './wordcard';

export interface Pack {
  length: number;
  title: string;
  array: Array<WordCard>;
}
