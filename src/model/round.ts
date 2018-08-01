import { Hand } from '@src/model/hand';

export class Round {
  constructor(
    public readonly hands: Hand[]
  ) {

  }
}
