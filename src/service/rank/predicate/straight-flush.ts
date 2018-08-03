import { Card, Value } from '@model/card';
import { SortableHand, SortedHand } from '@model/sorted-hand';
import { RankPredicate } from '@service/rank/predicate/rank-predicate';
import { Straight } from '@service/rank/predicate/straight';
import { ValueSorter } from '@service/rank/sort/value-sorter';

export class StraightFlush implements RankPredicate {

  constructor(
    protected straight: Straight = new Straight(),
    protected valueSorter: ValueSorter = new ValueSorter(),
  ) {

  }

  is(hand: SortableHand): boolean {
    return this.find(hand, 1).length > 0;
  }

  find(hand: SortableHand, max?: number): SortedHand[] {
    const cards = SortedHand.wrap(hand).hand.cards.reverse();
    const suits: { [key: string]: Card[] } = {};
    cards.forEach(card => {
      const suit = suits[card.suit] = suits[card.suit] || [];
      suit.push(card);
    });
    const hands: SortedHand[] = [];
    Object.keys(suits)
      .forEach(k => hands.push(...this.straight.find(suits[k])));
    return hands
      .sort((a, b) => {
        const ac = a.hand.cards.slice().reverse();
        const bc = b.hand.cards.slice().reverse();
        const i = ac[0].value === Value.Ace && bc[0].value === Value.Ace ? 0 : 1;
        return this.valueSorter.sort(ac[i].value, bc[i].value);
      })
      .slice(0, max || hands.length);
  }

}
