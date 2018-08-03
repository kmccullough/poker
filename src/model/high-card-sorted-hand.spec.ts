import { Card, Suit } from '@model/card';
import { Hand } from '@model/hand';
import { HighCardSortedHand } from '@model/high-card-sorted-hand';
import { CardToShorthand } from '@pipe/card-to-shorthand';
import { HandFromShorthand } from '@pipe/hand-from-shorthand';

const handFromShorthand = new HandFromShorthand();
const cardToShorthand = new CardToShorthand();

describe('HighCardSortedHand model', () => {

  describe('should not modify', () => {

    it('given Hand', () => {
      const cards: Card[] = [
        new Card(2, Suit.Heart),
        new Card(3, Suit.Heart),
      ];
      const hand = new Hand(cards);
      const sorted = new HighCardSortedHand(hand);
      expect(
        cards[0].value
      ).toBe(2);
    });

    it('given Card array', () => {
      const cards: Card[] = [
        new Card(2, Suit.Heart),
        new Card(3, Suit.Heart),
      ];
      const sorted = new HighCardSortedHand(cards);
      expect(
        cards[0].value
      ).toBe(2);
    });

  });

  describe('should sort', () => {

    [
      { input: '2C 3D 4C 5S 6H', output: '6H 5S 4C 3D 2C' },
      { input: '6H 5C 4S 3D 2D', output: '6H 5C 4S 3D 2D' },
      { input: '2H JD AC 7S QS', output: 'AC QS JD 7S 2H' },
      { input: '2C TD 9H KD 3D', output: 'KD TD 9H 3D 2C' },
      { input: '2D 2H 2S 2C', output: '2S 2C 2D 2H' },
      { input: '2C 2C 2C', output: '2C 2C 2C' },
    ].forEach(({ input, output }) => {

      it(`hand ${input} to order ${output}`, () => {
        expect(
          new HighCardSortedHand(
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
