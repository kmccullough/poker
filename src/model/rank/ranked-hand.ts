import { SortableHand, SortedHand } from '@model/sorted-hand';

export interface RankedHandConstructor {
  new (hand: SortableHand): RankedHand;
}

export abstract class RankedHand extends SortedHand {

}
