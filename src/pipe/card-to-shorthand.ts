import { Card, Suit, Value } from '@model/card';
import { Shorthand } from '@model/card-shorthand';
import { Pipe } from '@pipe/pipe';

const cardKeys: { [key: string]: string } = {
  [Value.Ten]:   'T',
  [Value.Jack]:  'J',
  [Value.Queen]: 'Q',
  [Value.King]:  'K',
  [Value.Ace]:   'A',
};

const suitKeys: { [key: string]: string } = {
  [Suit.Heart]:   'H',
  [Suit.Diamond]: 'D',
  [Suit.Club]:    'C',
  [Suit.Spade]:   'S',
};

export class CardToShorthand implements Pipe {
  transform(card: Card): Shorthand {
    return (cardKeys[card.value] || card.value)
      + suitKeys[card.suit];
  }
}
