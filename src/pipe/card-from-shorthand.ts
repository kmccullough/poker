import { Card, Suit, Value } from '@model/card';
import { matchShorthandSuitPartial, matchShorthandValuePartial, Shorthand } from '@model/card-shorthand';
import { Pipe } from '@pipe/pipe';

/* tslint:disable:object-literal-sort-keys */
const values: { [key: string]: (v: string) => Value } = {
  a: v => Value.Ace,
  t: v => Value.Ten,
  j: v => Value.Jack,
  q: v => Value.Queen,
  k: v => Value.King,
  default: v => +v
};

const suits: { [key: string]: Suit } = {
  h: Suit.Heart,
  d: Suit.Diamond,
  c: Suit.Club,
  s: Suit.Spade
};
/* tslint:enable:object-literal-sort-keys */

const matchShorthand = new RegExp(
  '(' + matchShorthandValuePartial + ')'
    + '(' + matchShorthandSuitPartial + ')',
  'i'
);

export class CardFromShorthand implements Pipe {
  transform(shorthand: Shorthand): Card {
    const match = shorthand.match(matchShorthand);
    if (!match) {
      throw Error(`Unknown card shorthand: ${shorthand}`);
    }
    const valueShorthand = match[1].toLowerCase();
    const valuePipe = values[valueShorthand]
      || values.default;
    const value = valuePipe(valueShorthand);
    const suitShorthand = match[2].toLowerCase();
    const suit = suits[suitShorthand];
    return new Card(value, suit);
  }
}
