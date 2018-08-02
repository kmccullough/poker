import { SortedHand } from '@model/sorted-hand';
import { CardToShorthand } from '@pipe/card-to-shorthand';
import { HandFromShorthand } from '@pipe/hand-from-shorthand';
import { ThreeOfAKind } from '@service/rank/predicate/three-of-a-kind';

const handFromShorthand = new HandFromShorthand();
const cardToShorthand = new CardToShorthand();

describe('ThreeOfAKind RankPredicate', () => {

  let threeOfAKind: ThreeOfAKind;

  beforeEach(() => {
    threeOfAKind = new ThreeOfAKind();
  });

  it('should not match with no cards', () => {
    expect(
      threeOfAKind.is([])
    ).toBeFalsy();
  });

  describe('should not match', () => {

    [
      { input: '2C 3D 4C 5S 6H' },
      { input: '6H TC 6S 3D 2D' },
      { input: 'AH 2D AC 7S 7S' },
      { input: '2C TD 9H KD 8D' },
    ].forEach(({ input }) => {

      it(`with hand ${input}`, () => {
        expect(
          threeOfAKind.is(new SortedHand(
            handFromShorthand.transform(input)
          ))
        ).toBeFalsy();
      });

    });

  });

  describe('should match', () => {

    [
      { input: '2S 6D 2C 2D 4S' },
      { input: 'JC JD JH AC AD AC' },
      { input: 'JH JH JH JH' },
    ].forEach(({ input }) => {

      it(`hand ${input}`, () => {
        expect(
          threeOfAKind.is(
            handFromShorthand.transform(input)
          )
        ).toBeTruthy();
      });

    });

  });

  describe('should find none', () => {

    [
      { input: '' },
      { input: '2C 3D 4C 5S 6H' },
      { input: '6H AC 6S 4D 2D' },
      { input: '7H 2D AC 7S 2S' },
      { input: '2C TD 9H KD 8D' },
    ].forEach(({ input }) => {

      it(`with hand ${input ? input : '[none]'}`, () => {
        expect(
          threeOfAKind.find(new SortedHand(
            input ? handFromShorthand.transform(input) : []
          ))
        ).toEqual([]);
      });

    });

  });

  describe('should find cards ordered by rank', () => {

    [
      { input: '2S 6D 2C 2D 4S', output: ['2S 2C 2D'] },
      { input: 'JC JD JH AC AD AC', output: ['AC AD AC', 'JC JD JH'] },
      { input: 'JH JH JH JH', output: ['JH JH JH'] },
    ].forEach(({ input, output }) => {

      it(`expecting hand ${input} to order ${output.join(' / ')}`, () => {
        expect(
          threeOfAKind.find(new SortedHand(
            handFromShorthand.transform(input)
          )).map(
            sorted => {
              return sorted.hand.cards
                .map(c => cardToShorthand.transform(c))
                .join(' ');
            }
          )
        ).toEqual(
          output.map(hand =>
            new SortedHand(
              handFromShorthand.transform(hand)
            ).hand.cards
              .map(c => cardToShorthand.transform(c))
              .join(' ')
          )
        );
      });

    });

  });

});
