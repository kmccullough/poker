import { Card, Suit } from '@model/card';
import { Hand } from '@model/hand';
import { SortedHand } from '@model/sorted-hand';
import { CardToShorthand } from '@pipe/card-to-shorthand';
import { HandFromShorthand } from '@pipe/hand-from-shorthand';

const handFromShorthand = new HandFromShorthand();
const cardToShorthand = new CardToShorthand();

describe('SortedHand model', () => {

  describe('should not modify', () => {

    it('given Hand', () => {
      const cards: Card[] = [
        new Card(3, Suit.Heart),
        new Card(2, Suit.Heart),
      ];
      const hand = new Hand(cards);
      const sorted = new SortedHand(hand);
      expect(
        cards[0].value
      ).toBe(3);
    });

    it('given Card array', () => {
      const cards: Card[] = [
        new Card(3, Suit.Heart),
        new Card(2, Suit.Heart),
      ];
      const sorted = new SortedHand(cards);
      expect(
        cards[0].value
      ).toBe(3);
    });

  });

  describe('should sort', () => {

    [
      { input: '2C 3D 4C 5S 6H', output: '2C 3D 4C 5S 6H' },
      { input: '6H 5C 4S 3D 2D', output: '2D 3D 4S 5C 6H' },
      { input: '2H JD AC 7S QS', output: '2H 7S JD QS AC' },
      { input: '2C TD 9H KD 3D', output: '2C 3D 9H TD KD' },
      { input: '2D 2H 2S 2C', output: '2H 2D 2C 2S' },
      { input: '2C 2C 2C', output: '2C 2C 2C' },
    ].forEach(({ input, output }) => {

      it(`hand ${input} to order ${output}`, () => {
        expect(
          new SortedHand(
            handFromShorthand.transform(input)
          ).hand.cards.map(
            c => cardToShorthand.transform(c)
          ).join(' ')
        ).toEqual(
          output
        );
      });

    });

  });

});
