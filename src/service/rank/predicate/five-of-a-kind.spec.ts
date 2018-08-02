import { SortedHand } from '@model/sorted-hand';
import { CardToShorthand } from '@pipe/card-to-shorthand';
import { HandFromShorthand } from '@pipe/hand-from-shorthand';
import { FiveOfAKind } from '@service/rank/predicate/five-of-a-kind';

const handFromShorthand = new HandFromShorthand();
const cardToShorthand = new CardToShorthand();

describe('FiveOfAKind RankPredicate', () => {

  let fiveOfAKind: FiveOfAKind;

  beforeEach(() => {
    fiveOfAKind = new FiveOfAKind();
  });

  it('should not match with no cards', () => {
    expect(
      fiveOfAKind.is([])
    ).toBeFalsy();
  });

  describe('should not match', () => {

    [
      { input: '2C 3D 4C 5S 6H' },
      { input: '6H 6C 6S 6D 2D' },
      { input: '7H 7D AC 7S 7S' },
      { input: '2C TD 9H KD 8D' },
    ].forEach(({ input }) => {

      it(`with hand ${input}`, () => {
        expect(
          fiveOfAKind.is(
            handFromShorthand.transform(input)
          )
        ).toBeFalsy();
      });

    });

  });

  describe('should match', () => {

    [
      { input: '2S 2C 2D 2S 2H' },
      { input: 'JC JD JH JC JD AC AD AC AS AH' },
      { input: 'JH JH JH JH JH JH' },
    ].forEach(({ input }) => {

      it(`hand ${input}`, () => {
        expect(
          fiveOfAKind.is(
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
      { input: '6H 6C 6S 6D 2D' },
      { input: '7H 7D AC 7S 7S' },
      { input: '2C TD 9H KD 8D' },
    ].forEach(({ input }) => {

      it(`with hand ${input ? input : '[none]'}`, () => {
        expect(
          fiveOfAKind.find(
            input ? handFromShorthand.transform(input) : []
          )
        ).toEqual([]);
      });

    });

  });

  describe('should find cards ordered by rank', () => {

    [
      { input: '2S 2C 2D 2S 2H', output: ['2S 2C 2D 2S 2H'] },
      { input: 'JC JD JH JC JD AC AD AC AS AH', output: ['AC AD AC AS AH', 'JC JD JH JC JD'] },
      { input: 'JH JH JH JH JH JH', output: ['JH JH JH JH JH'] },
    ].forEach(({ input, output }) => {

      it(`expecting hand ${input} to order ${output.join(' / ')}`, () => {
        expect(
          fiveOfAKind.find(
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
