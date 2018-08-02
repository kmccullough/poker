import { Card, Suit, Value } from '@model/card';
import { CardFromShorthand } from '@pipe/card-from-shorthand';

describe('CardFromShorthand pipe', () => {

  let cardsFromShorthand: CardFromShorthand;

  beforeEach(() => {
    cardsFromShorthand = new CardFromShorthand();
  });

  describe('should transform', () => {

    [
      { input: '2H', output: () => new Card(2, Suit.Heart) },
      { input: 'JD', output: () => new Card(Value.Jack, Suit.Diamond) },
      { input: 'AC', output: () => new Card(Value.Ace, Suit.Club) },
      { input: '7S', output: () => new Card(7, Suit.Spade) },
      { input: 'QS', output: () => new Card(Value.Queen, Suit.Spade) },
      { input: '2C', output: () => new Card(Value.Two, Suit.Club) },
      { input: 'TD', output: () => new Card(10, Suit.Diamond) },
      { input: '9H', output: () => new Card(9, Suit.Heart) },
      { input: 'KD', output: () => new Card(Value.King, Suit.Diamond) },
    ].forEach(({ input, output }) => {

      it(`shorthand ${input} to expected card object`, () => {
        expect(
          cardsFromShorthand.transform(input)
        ).toEqual(
          output()
        );
      });

    });

  });

  describe('should raise exception', () => {

    [
      { input: '2F' },
      { input: 'FD' },
      { input: 'AA' },
      { input: '1S' },
      { input: '' },
      { input: 'null' },
      { input: 'undefined' },
    ].forEach(({ input }) => {

      it(`with unrecognized shorthand ${input}`, () => {
        expect(() => {
          cardsFromShorthand.transform(input);
        }).toThrowError();
      });

    });

  });

});
