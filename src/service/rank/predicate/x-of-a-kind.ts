import { Card } from '@model/card';
import { SortableHand, SortedHand } from '@model/sorted-hand';
import { RankPredicate } from '@service/rank/predicate/rank-predicate';

export class XOfAKind implements RankPredicate {

  constructor(
    public readonly x: number
  ) {
    if (!x || x < 2) {
      throw Error('XOfAKind requires x greater than 1');
    }
  }

  is(hand: SortableHand): boolean {
    const cards = SortedHand.wrap(hand).hand.cards;
    if (cards.length < this.x) {
      return false;
    }
    let count = 0;
    let value: number;
    cards.some(card => {
      if (value !== card.value) {
        value = card.value;
        count = 1;
      } else {
        ++count;
      }
      return count === this.x;
    });
    return count === this.x;
  }

  find(hand: SortableHand, max?: number): SortedHand[] {
    const cards = SortedHand.wrap(hand).hand.cards.reverse();
    if (cards.length < this.x) {
      return [];
    }
    const hands: SortedHand[] = [];
    let ranked: Card[] = [];
    let last: number;
    cards.some(card => {
      if (last !== card.value) {
        ranked = [card];
        last = card.value;
      } else if (ranked.length < this.x) {
        ranked.push(card);
        if (ranked.length === this.x) {
          hands.push(new SortedHand(ranked));
        }
      }
      return hands.length === max;
    });
    return hands;
  }

}
