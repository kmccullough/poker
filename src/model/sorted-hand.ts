import { Card, Suit, Value } from '@model/card';
import { Hand } from '@model/hand';

export const valueSortIndex: { [key: string]: number } = {
  // 2...9
  [Value.Ten]:   10,
  [Value.Jack]:  11,
  [Value.Queen]: 12,
  [Value.King]:  13,
  [Value.Ace]:   14,
};

export const suitSortIndex: { [key: string]: number } = {
  [Suit.Heart]:   0,
  [Suit.Diamond]: 1,
  [Suit.Club]:    2,
  [Suit.Spade]:   3,
};

export type SortableHand = SortedHand | Hand | Card[];

/**
 * Sorts hand on instantiation and assures sorting by type
 */
export class SortedHand {

  static sortCards(a: Card, b: Card): number {
    return SortedHand.sortCardValues(a.value, b.value)
      || SortedHand.sortCardSuits(
        suitSortIndex[a.suit],
        suitSortIndex[b.suit]
      );
  }

  static sortCardValues(a: Value, b: Value): number {
    const av = valueSortIndex[a] || a;
    const bv = valueSortIndex[b] || b;
    return av < bv ? -1 : av > bv ? 1 : 0;
  }

  static sortCardSuits(a: Suit, b: Suit): number {
    const as = suitSortIndex[a];
    const bs = suitSortIndex[b];
    return as < bs ? -1 : as > bs ? 1 : 0;
  }

  static sort(hand: SortableHand): Hand {
    if (hand instanceof SortedHand) {
      return hand.hand;
    }
    const cards = hand instanceof Hand ? hand.cards : hand;
    return new Hand(cards.slice().sort(SortedHand.sortCards));
  }

  /**
   * Sorts a hand or returns already sorted hand
   * @param {SortableHand} hand Hand to sort or passed through if already sorted
   * @returns {SortedHand}
   */
  static wrap(hand: SortableHand): SortedHand {
    return (hand instanceof SortedHand) ? hand : new SortedHand(hand);
  }

  public readonly hand: Hand;

  constructor(hand: SortableHand) {
    this.hand = SortedHand.sort(hand);
  }

}
