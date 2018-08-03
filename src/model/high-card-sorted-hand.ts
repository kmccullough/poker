import { Card } from '@model/card';
import { Hand } from '@model/hand';
import { SortedHand } from '@model/sorted-hand';
import { CardSorter } from '@service/sort/card-sorter';

export type HighCardSortableHand = HighCardSortedHand | SortedHand | Hand | Card[];

/**
 * Sorts hand on instantiation and assures sorting by type
 */
export class HighCardSortedHand {

  /**
   * Sorts a hand or returns already sorted hand
   * @param {HighCardSortedHand} hand Hand to sort or passed through if already sorted
   * @returns {HighCardSortedHand}
   */
  static wrap(hand: HighCardSortableHand): HighCardSortedHand {
    return (hand instanceof HighCardSortedHand)
      ? hand : new HighCardSortedHand(hand);
  }

  public readonly hand: Hand;

  constructor(
    hand: HighCardSortableHand,
    protected cardSorter: CardSorter = new CardSorter()
  ) {
    if (hand instanceof HighCardSortedHand || hand instanceof SortedHand) {
      this.hand = hand.hand;
    } else {
      const cards = hand instanceof Hand ? hand.cards : hand;
      this.hand = new Hand(
        cards.slice().sort((a, b) => {
          const result = this.cardSorter.sort(a, b);
          return result < 0 ? 1 : result > 0 ? -1 : 0;
        })
      );
    }
  }

}
