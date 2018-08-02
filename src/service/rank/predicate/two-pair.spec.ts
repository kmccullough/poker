import { SortedHand } from '@model/sorted-hand';
import { CardToShorthand } from '@pipe/card-to-shorthand';
import { HandFromShorthand } from '@pipe/hand-from-shorthand';
import { TwoPair } from '@service/rank/predicate/two-pair';

const handFromShorthand = new HandFromShorthand();
const cardToShorthand = new CardToShorthand();

describe('TwoPair RankPredicate', () => {

  let twoPair: TwoPair;

  beforeEach(() => {
    twoPair = new TwoPair();
  });

  it('should not match with no cards', () => {
    expect(
      twoPair.is([])
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
          twoPair.is(new SortedHand(
            handFromShorthand.transform(input)
          ))
        ).toBeFalsy();
      });

    });

  });

  describe('should match', () => {

    [
      { input: '2S 2C 4D 4S' },
      { input: 'JC JD JH JC AC AD AC AS' },
    ].forEach(({ input }) => {

      it(`hand ${input}`, () => {
        expect(
          twoPair.is(
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
          twoPair.find(new SortedHand(
            input ? handFromShorthand.transform(input) : []
          ))
        ).toEqual([]);
      });

    });

  });

  describe('should find cards ordered by rank', () => {

    [
      { input: '2S 2C 4D 4S', output: ['2S 2C 4D 4S'] },
      { input: 'JC JD JH JC AC AD AC AS', output: ['AD AC JH JD'] },
    ].forEach(({ input, output }) => {

      it(`expecting hand ${input} to order ${output.join(' / ')}`, () => {
        expect(
          twoPair.find(new SortedHand(
            handFromShorthand.transform(input)
          )).map(
            sorted => {
              return sorted.hand.cards
                .map(c => cardToShorthand.transform(c).charAt(0))
                .join('');
            }
          )
        ).toEqual(
          output.map(hand =>
            new SortedHand(
              handFromShorthand.transform(hand)
            ).hand.cards
              .map(c => cardToShorthand.transform(c).charAt(0))
              .join('')
          )
        );
      });

    });

  });

});
