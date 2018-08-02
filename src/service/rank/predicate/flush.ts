import { Card, Value } from '@model/card';
import { SortableHand, SortedHand } from '@model/sorted-hand';
import { RankPredicate } from '@service/rank/predicate/rank-predicate';

export class Flush implements RankPredicate {

  is(hand: SortableHand): boolean {
    return this.find(hand, 1).length > 0;
  }

  find(hand: SortableHand, max?: number): SortedHand[] {
    const cards = SortedHand.wrap(hand).hand.cards.reverse();
    const suits: { [key: string]: { highCard: Value, cards: Card[] } } = {};
    cards.forEach(card => {
      const suit = suits[card.suit] = suits[card.suit] || { cards: [] };
      if (!suit.highCard || card.value > suit.highCard) {
        suit.highCard = card.value;
      }
      suit.cards.push(card);
    });
    return Object.keys(suits)
      .filter(k => suits[k].cards.length >= 5)
      .map(k => suits[k])
      .sort((a, b) =>
        SortedHand.sortCardValues(a.highCard, b.highCard)
      )
      .slice(0, max || 4)
      .map(h => new SortedHand(h.cards));
  }

}
