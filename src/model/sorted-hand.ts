import { Card } from '@model/card';
import { Hand } from '@model/hand';
import { CardSorter } from '@service/rank/sort/card-sorter';

export type SortableHand = SortedHand | Hand | Card[];

/**
 * Sorts hand on instantiation and assures sorting by type
 */
export class SortedHand {

  /**
   * Sorts a hand or returns already sorted hand
   * @param {SortableHand} hand Hand to sort or passed through if already sorted
   * @returns {SortedHand}
   */
  static wrap(hand: SortableHand): SortedHand {
    return (hand instanceof SortedHand) ? hand : new SortedHand(hand);
  }

  public readonly hand: Hand;

  constructor(
    hand: SortableHand,
    protected cardSorter: CardSorter = new CardSorter()
  ) {
    if (hand instanceof SortedHand) {
      this.hand = hand.hand;
    } else {
      const cards = hand instanceof Hand ? hand.cards : hand;
      this.hand = new Hand(cards.slice().sort(this.cardSorter.sort));
    }
  }

}
