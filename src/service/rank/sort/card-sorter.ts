import { Card } from '@model/card';
import { Sorter } from '@service/rank/sort/sorter';
import { SuitSorter } from '@service/rank/sort/suit-sorter';
import { ValueSorter } from '@service/rank/sort/value-sorter';

export interface CardSorter extends Sorter {
  sort(a: Card, b: Card): number;
}

export class CardSorter implements CardSorter {

  constructor(
    protected readonly valueSorter: ValueSorter = new ValueSorter(),
    protected readonly suitSorter: SuitSorter = new SuitSorter(),
  ) {
    this.sort = this.sort.bind(this);
  }

  sort(a: Card, b: Card): number {
    return this.valueSorter.sort(a.value, b.value)
      || this.suitSorter.sort(a.suit, b.suit);
  }

}
