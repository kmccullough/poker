import { Card } from '@model/card';
import { Hand } from '@model/hand';
import { Round } from '@model/round';
import { CardFromShorthand } from '@pipe/card-from-shorthand';
import { Pipe } from '@pipe/pipe';

const cardFromShorthand = new CardFromShorthand();

const matchSpaces = /\s+/;

export class RoundFromShorthand implements Pipe {
  transform(shorthand: string, handSize: number = 5): Round {
    const hands: Hand[] = [];
    const cards = shorthand.trim().split(matchSpaces);
    let hand: Card[] = [];
    cards.forEach(card => {
      hand.push(cardFromShorthand.transform(card));
      if (hand.length === handSize) {
        hands.push(new Hand(hand));
        hand = [];
      }
    });
    return new Round(hands);
  }
}
