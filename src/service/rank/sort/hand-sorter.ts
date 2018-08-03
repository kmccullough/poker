import { FullHand } from '@model/full-hand';
import { RankedHandConstructor } from '@model/rank/ranked-hand';
import { Sorter } from '@service/rank/sort/sorter';

export interface HandSorter extends Sorter {
  sort(a: FullHand, b: FullHand): number;
}

export class HandSorter implements HandSorter {

  protected ranks: Map<RankedHandConstructor, number> = new Map();

  constructor(
    ranks: RankedHandConstructor[],
  ) {
    ranks.forEach((Rank, i) => {
      // Map compared rank class to numerical rank for sorting ranked hands
      this.ranks.set(Rank, i);
    });

    this.sort = this.sort.bind(this);
  }

  sort(a: FullHand, b: FullHand): number {
    const av = this.ranks.get(Object.getPrototypeOf(a.ranked));
    const bv = this.ranks.get(Object.getPrototypeOf(a.ranked));
    if (av === undefined || bv === undefined) {
      throw Error('Hand sorter encountered an unknown rank type');
    }
    let result = av > bv ? -1 : av < bv ? 1 : 0;
    if (!result) {
      a.other.hand.cards.some((ac, i) => {
        const bc = b.other.hand.cards[i];
        result = ac > bc ? -1 : ac < bc ? 1 : 0;
        return !!result;
      });
    }
    return result;
  }

}
