import { SortedHand } from '@model/sorted-hand';
import { CardToShorthand } from '@pipe/card-to-shorthand';
import { HandFromShorthand } from '@pipe/hand-from-shorthand';
import { FourOfAKind } from '@service/rank/predicate/four-of-a-kind';

const handFromShorthand = new HandFromShorthand();
const cardToShorthand = new CardToShorthand();

describe('FourOfAKind RankPredicate', () => {

  let fourOfAKind: FourOfAKind;

  beforeEach(() => {
    fourOfAKind = new FourOfAKind();
  });

  it('should not match with no cards', () => {
    expect(
      fourOfAKind.is([])
    ).toBeFalsy();
  });

  describe('should not match', () => {

    [
      { input: '2C 3D 4C 5S 6H' },
      { input: '6H 6C 6S 3D 2D' },
      { input: '7H 2D AC 7S 7S' },
      { input: '2C TD 9H KD 8D' },
    ].forEach(({ input }) => {

      it(`with hand ${input}`, () => {
        expect(
          fourOfAKind.is(
            handFromShorthand.transform(input)
          )
        ).toBeFalsy();
      });

    });

  });

  describe('should match', () => {

    [
      { input: '2S 2C 2D 2S' },
      { input: 'JC JD JH JC AC AD AC AS' },
      { input: 'JH JH JH JH JH' },
    ].forEach(({ input }) => {

      it(`hand ${input}`, () => {
        expect(
          fourOfAKind.is(
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
      { input: '6H 6C 6S 4D 2D' },
      { input: '7H 2D AC 7S 7S' },
      { input: '2C TD 9H KD 8D' },
    ].forEach(({ input }) => {

      it(`with hand ${input ? input : '[none]'}`, () => {
        expect(
          fourOfAKind.find(
            input ? handFromShorthand.transform(input) : []
          )
        ).toEqual([]);
      });

    });

  });

  describe('should find cards ordered by rank', () => {

    [
      { input: '2S 2C 2D 2S', output: ['2S 2C 2D 2S'] },
      { input: 'JC JD JH JC AC AD AC AS', output: ['AC AD AC AS', 'JC JD JH JC'] },
      { input: 'JH JH JH JH JH', output: ['JH JH JH JH'] },
    ].forEach(({ input, output }) => {

      it(`expecting hand ${input} to order ${output.join(' / ')}`, () => {
        expect(
          fourOfAKind.find(
            handFromShorthand.transform(input)
          ).map(
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
