import { FullHand } from '@model/full-hand';
import { RankedHandConstructor } from '@model/rank/ranked-hand';
import { Sorter } from '@service/sort/sorter';

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
      this.ranks.set(Rank, ranks.length - i);
    });

    this.sort = this.sort.bind(this);
  }

  sort(a: FullHand, b: FullHand): number {
    const AType = Object.getPrototypeOf(a.ranked).constructor;
    const BType = Object.getPrototypeOf(b.ranked).constructor;
    let av = this.ranks.get(AType);
    let bv = this.ranks.get(BType);
    if (av === undefined || bv === undefined) {
      throw Error('Hand sorter encountered an unknown rank type');
    }
    // Compare ranks
    let result = av > bv ? -1 : av < bv ? 1 : 0;
    // Compare cards within ranks
    if (!result && AType === BType) {
      result = a.ranked.sort(b.ranked);
    }
    // Compare highest other cards
    if (!result) {
      a.other.hand.cards.some((aCard, i) => {
        av = aCard.value;
        bv = b.other.hand.cards[i].value;
        if (av === undefined || bv === undefined) {
          result = 0;
        } else {
          result = av > bv ? -1 : av < bv ? 1 : 0;
        }
        return !!result;
      });
    }
    return result;
  }

}
