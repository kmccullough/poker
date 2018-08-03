import { HighCardSortedHand } from '@model/high-card-sorted-hand';
import { RankedHand } from '@model/rank/ranked-hand';

export class FullHand {

  constructor(
    public readonly ranked: RankedHand,
    public readonly other: HighCardSortedHand,
  ) {

  }

}
