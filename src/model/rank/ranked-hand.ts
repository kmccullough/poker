import { SortableHand, SortedHand } from '@model/sorted-hand';
import { CardSorter } from '@service/sort/card-sorter';
import { RankedHandSorter } from '@service/sort/ranked-hand-sorter';
import { Sorter } from '@service/sort/sorter';

export interface RankedHandConstructor {
  new (hand: SortableHand): RankedHand;
}

export abstract class RankedHand extends SortedHand implements Sorter {
  protected constructor(
    hand: SortableHand,
    protected readonly rankedHandSorter: RankedHandSorter = new RankedHandSorter(),
    cardSorter?: CardSorter,
  ) {
    super(hand, cardSorter);
    this.sort = this.sort.bind(this);
  }

  sort(b: RankedHand): number {
    return this.rankedHandSorter.sort(this, b);
  }
}
