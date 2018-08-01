import { Card, Suit, Value } from '@src/model/card';
import { HandFromShorthand } from '@src/pipe/hand-from-shorthand';
import { Hand } from '@src/model/hand';

describe('HandFromShorthand pipe', () => {

  let handFromShorthand: HandFromShorthand;

  beforeEach(() => {
    handFromShorthand = new HandFromShorthand();
  });

  describe('should transform', () => {

    [
      {
        input: 'KD',
        output: () => new Hand([
          new Card(Value.King, Suit.Diamond)
        ])
      },
      {
        input: '2C TD 9H',
        output: () => new Hand([
          new Card(Value.Two, Suit.Club),
          new Card(10, Suit.Diamond),
          new Card(9, Suit.Heart),
        ])
      },
      {
        input: '2H JD AC 7S QS',
        output: () => new Hand([
          new Card(2, Suit.Heart),
          new Card(Value.Jack, Suit.Diamond),
          new Card(Value.Ace, Suit.Club),
          new Card(7, Suit.Spade),
          new Card(Value.Queen, Suit.Spade),
        ])
      },
      {
        input: 'JC 5D 6S JS KS QS AS',
        output: () => new Hand([
          new Card(Value.Jack, Suit.Club),
          new Card(5, Suit.Diamond),
          new Card(6, Suit.Spade),
          new Card(Value.Jack, Suit.Spade),
          new Card(Value.King, Suit.Spade),
          new Card(Value.Queen, Suit.Spade),
          new Card(Value.Ace, Suit.Spade),
        ])
      },
    ].forEach(({ input, output }) => {

      it(`shorthand ${input} to expected card object`, () => {
        expect(
          handFromShorthand.transform(input)
        ).toEqual(
          output()
        );
      });

    });

  });

  describe('should raise exception', () => {

    [
      { input: '' },
      { input: '1S' },
      { input: '2F FD AA' },
      { input: 'null' },
      { input: 'undefined' },
    ].forEach(({ input }) => {

      it(`with unrecognized shorthand ${input}`, () => {
        expect(() => {
          handFromShorthand.transform(input);
        }).toThrowError();
      });

    });

  });

});
