import { Suit } from '@model/card';
import { Sorter } from '@service/sort/sorter';

export interface SuitSorter extends Sorter {
  sort(a: Suit, b: Suit): number;
}

export const suitSortIndex: { [key: string]: number } = {
  [Suit.Heart]:   0,
  [Suit.Diamond]: 1,
  [Suit.Club]:    2,
  [Suit.Spade]:   3,
};

export class SuitSorter implements SuitSorter {

  sort(a: Suit, b: Suit): number {
    const as = suitSortIndex[a];
    const bs = suitSortIndex[b];
    return as < bs ? -1 : as > bs ? 1 : 0;
  }

}
