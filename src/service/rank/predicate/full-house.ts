import { SortableHand, SortedHand } from '@model/sorted-hand';
import { RankPredicate } from '@service/rank/predicate/rank-predicate';
import { XOfAKind } from '@service/rank/predicate/x-of-a-kind';

export class FullHouse implements RankPredicate {

  protected xOfAKind2: XOfAKind;
  protected xOfAKind3: XOfAKind;

  constructor() {
    this.xOfAKind2 = new XOfAKind(2);
    this.xOfAKind3 = new XOfAKind(3);
  }

  is(hand: SortableHand): boolean {
    return this.find(hand, 1).length > 0;
  }

  find(hand: SortableHand, max?: number): SortedHand[] {
    const cards = SortedHand.wrap(hand).hand.cards.reverse();
    const threes = this.xOfAKind3.find(cards);
    if (!threes.length) {
      return [];
    }
    const hands: SortedHand[] = [];
    threes.some(three => {
      const value = three.hand.cards[0].value;
      const subHand = cards.filter(c => c.value !== value);
      const twos = this.xOfAKind2.find(subHand, 1);
      if (twos.length) {
        hands.push(new SortedHand([
          ...three.hand.cards,
          ...twos[0].hand.cards,
        ]));
      }
      return hands.length === max;
    });
    return hands;
  }

}
