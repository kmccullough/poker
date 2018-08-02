import { SortableHand, SortedHand } from '@model/sorted-hand';
import { RankPredicate } from '@service/rank/predicate/rank-predicate';
import { XOfAKind } from '@service/rank/predicate/x-of-a-kind';

export class TwoPair implements RankPredicate {

  protected xOfAKind: XOfAKind;

  constructor() {
    this.xOfAKind = new XOfAKind(2);
  }

  is(hand: SortableHand): boolean {
    return this.xOfAKind.find(hand, 2).length === 2;
  }

  find(hand: SortableHand, max?: number): SortedHand[] {
    const pairs = this.xOfAKind.find(hand);
    if (pairs.length < 2) {
      return [];
    }
    // For now we'll just return the first found two pair
    return [new SortedHand([
      ...pairs[0].hand.cards,
      ...pairs[1].hand.cards
    ])];
  }

}
