import { SortableHand, SortedHand } from '@model/sorted-hand';

export interface RankPredicate {
  is(hand: SortableHand): boolean;
  find(hand: SortableHand): SortedHand[];
}
