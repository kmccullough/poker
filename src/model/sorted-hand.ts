import { Card, Value } from '@src/model/card';
import { Hand } from '@src/model/hand';

export const sortIndex: { [key: string]: number } = {
  // 2...9
  [Value.Ten]:   10,
  [Value.Jack]:  11,
  [Value.Queen]: 12,
  [Value.King]:  13,
  [Value.Ace]:   14,
};

/**
 * Sorts hand on instantiation and assures sorting by type
 */
export class SortedHand {

  static sort(hand: Card[] | Hand): Hand {
    const cards = hand instanceof Hand ? hand.cards : hand;
    return new Hand(cards.sort((a, b) => {
      const av = sortIndex[a.value] || a.value;
      const bv = sortIndex[b.value] || b.value;
      return av < bv ? -1 : av > bv ? 1 : 0;
    }));
  }

  public readonly hand: Hand;

  constructor(
    hand: Card[] | Hand
  ) {
    this.hand = SortedHand.sort(hand);
  }

}
