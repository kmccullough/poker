import { RankedHand } from '@model/rank/ranked-hand';
import { SortableHand } from '@model/sorted-hand';
import { CardSorter } from '@service/sort/card-sorter';
import { RankedHandSorter } from '@service/sort/ranked-hand-sorter';

export class FourOfAKind extends RankedHand {

  constructor(
    hand: SortableHand,
    rankedHandSorter?: RankedHandSorter,
    cardSorter?: CardSorter,
  ) {
    super(hand, rankedHandSorter, cardSorter);
  }

}
