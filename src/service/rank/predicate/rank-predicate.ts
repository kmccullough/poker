import { SortableHand, SortedHand } from '@model/sorted-hand';

export interface RankPredicateConstructor {
  new (): RankPredicate;
}

export interface RankPredicate {
  is(hand: SortableHand): boolean;
  find(hand: SortableHand, max?: number): SortedHand[];
}
