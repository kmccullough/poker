import { Hand } from '@src/model/hand';
import { CardFromShorthand } from '@src/pipe/card-from-shorthand';
import { Pipe } from '@src/pipe/pipe';

const cardFromShorthand = new  CardFromShorthand();

const matchSpaces = /\s+/;

export class HandFromShorthand implements Pipe {
  transform(shorthand: string): Hand {
    const cards = shorthand.trim().split(matchSpaces);
    return new Hand(
      cards.map(card =>
        cardFromShorthand.transform(card)
      )
    );
  }
}
