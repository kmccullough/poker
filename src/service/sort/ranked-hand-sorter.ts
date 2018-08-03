import { RankedHand } from '@model/rank/ranked-hand';
import { SortedHand } from '@model/sorted-hand';
import { Sorter } from '@service/sort/sorter';
import { ValueSorter } from '@service/sort/value-sorter';

export class RankedHandSorter implements Sorter {

  constructor(
    protected readonly valueSorter: ValueSorter = new ValueSorter(),
  ) {

  }

  sort(a: RankedHand, b: RankedHand): number {
    const ac = SortedHand.wrap(a).hand.cards;
    const bc = SortedHand.wrap(b).hand.cards;
    let result = 0;
    const max = Math.min(ac.length, bc.length) - 1;
    for (let i = max; i >= 0 && !result; --i) {
      result = -this.valueSorter.sort(
        ac[i].value,
        bc[i].value
      );
    }
    return result;
  }

}
