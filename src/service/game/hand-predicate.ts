import { FullHand } from '@model/full-hand';
import { SortableHand } from '@model/sorted-hand';

export interface HandPredicate {
  is(hand: SortableHand): boolean;
  find(hand: SortableHand, max?: number): FullHand[];
}
