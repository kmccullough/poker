import { SortableHand, SortedHand } from '@model/sorted-hand';
import { RankPredicate } from '@service/rank/predicate/rank-predicate';
import { XOfAKind } from '@service/rank/predicate/x-of-a-kind';

export class FiveOfAKind implements RankPredicate {

  protected xOfAKind: XOfAKind;

  constructor() {
    this.xOfAKind = new XOfAKind(5);
  }

  is(hand: SortableHand): boolean {
    return this.xOfAKind.is(hand);
  }

  find(hand: SortableHand, max?: number): SortedHand[] {
    return this.xOfAKind.find(hand, max);
  }

}
