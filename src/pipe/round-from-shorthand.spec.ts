import { Card, Suit, Value } from '@model/card';
import { Hand } from '@model/hand';
import { Round } from '@model/round';
import { RoundFromShorthand } from '@pipe/round-from-shorthand';

describe('RoundFromShorthand pipe', () => {

  let roundFromShorthand: RoundFromShorthand;

  beforeEach(() => {
    roundFromShorthand = new RoundFromShorthand();
  });

  describe('should transform', () => {

    [
      {
        input: 'TH 8S JS 3C 4C 2D 5H 7D 9D AC',
        output: () => new Round([
          new Hand([
            new Card(10, Suit.Heart),
            new Card(8, Suit.Spade),
            new Card(Value.Jack, Suit.Spade),
            new Card(3, Suit.Club),
            new Card(4, Suit.Club),
          ]),
          new Hand([
            new Card(2, Suit.Diamond),
            new Card(5, Suit.Heart),
            new Card(7, Suit.Diamond),
            new Card(9, Suit.Diamond),
            new Card(Value.Ace, Suit.Club),
          ]),
        ])
      },
    ].forEach(({ input, output }) => {

      it(`shorthand ${input} to expected card object`, () => {
        expect(
          roundFromShorthand.transform(input)
        ).toEqual(
          output()
        );
      });

    });

  });

  describe('should raise exception', () => {

    [
      { input: 'TH 8S JS 3C 1C 2D 5H 7D 9D AC' },
    ].forEach(({ input }) => {

      it(`with unrecognized shorthand ${input}`, () => {
        expect(() => {
          roundFromShorthand.transform(input);
        }).toThrowError();
      });

    });

  });

});
