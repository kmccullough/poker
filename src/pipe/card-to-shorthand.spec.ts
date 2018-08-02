import { Card, Suit, Value } from '@model/card';
import { CardToShorthand } from '@pipe/card-to-shorthand';

describe('CardToShorthand pipe', () => {

  let cardsToShorthand: CardToShorthand;

  beforeEach(() => {
    cardsToShorthand = new CardToShorthand();
  });

  describe('should transform', () => {

    [
      { input: () => new Card(2, Suit.Heart), output: '2H' },
      { input: () => new Card(Value.Jack, Suit.Diamond), output: 'JD' },
      { input: () => new Card(Value.Ace, Suit.Club), output: 'AC' },
      { input: () => new Card(7, Suit.Spade), output: '7S' },
      { input: () => new Card(Value.Queen, Suit.Spade), output: 'QS' },
      { input: () => new Card(Value.Two, Suit.Club), output: '2C' },
      { input: () => new Card(10, Suit.Diamond), output: 'TD' },
      { input: () => new Card(9, Suit.Heart), output: '9H' },
      { input: () => new Card(Value.King, Suit.Diamond), output: 'KD' },
    ].forEach(({ input, output }) => {

      it(`to shorthand ${output}`, () => {
        expect(
          cardsToShorthand.transform(input())
        ).toEqual(
          output
        );
      });

    });

  });

});
