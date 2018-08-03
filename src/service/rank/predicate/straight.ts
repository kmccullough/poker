import { Card, Value } from '@model/card';
import { SortableHand, SortedHand } from '@model/sorted-hand';
import { RankPredicate } from '@service/rank/predicate/rank-predicate';
import { valueIndex } from '@service/rank/sort/value-sorter';

export class Straight implements RankPredicate {

  is(hand: SortableHand): boolean {
    return this.find(hand, 1).length > 0;
  }

  find(hand: SortableHand, max?: number): SortedHand[] {
    const cards = SortedHand.wrap(hand).hand.cards.reverse();
    const aces: Card[] = [];
    cards.some(c => {
      if (c.value === Value.Ace) {
        aces.push(c);
      }
      return c.value !== Value.Ace;
    });
    cards.push(...aces);
    const hands: SortedHand[] = [];
    let ranked: Card[] = [];
    let last: number;
    cards.some(card => {
      if (last === card.value) {
        // Ignore duplicate card
      } else if (!last || last - 1 !== card.value
        || last === 2 && card.value !== Value.Ace
      ) {
        ranked = [card];
      } else if (ranked.length < 5) {
        ranked.push(card);
        if (ranked.length === 5) {
          hands.push(new SortedHand(ranked));
          ranked = ranked.slice(1);
        }
      }
      last = valueIndex(card.value);
      return hands.length === max;
    });
    return hands;
  }

}
