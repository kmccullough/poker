import { SortableHand, SortedHand } from '@model/sorted-hand';
import { RankPredicate } from '@service/rank/predicate/rank-predicate';

export class HighCard implements RankPredicate {

  is(hand: SortableHand): boolean {
    return SortedHand.wrap(hand).hand.cards.length > 0;
  }

  find(hand: SortableHand, max?: number): SortedHand[] {
    const cards = SortedHand.wrap(hand).hand.cards.reverse();
    return cards.map(c => SortedHand.wrap([c]));
  }

}
