import { SortedHand } from '@model/sorted-hand';
import { CardToShorthand } from '@pipe/card-to-shorthand';
import { HandFromShorthand } from '@pipe/hand-from-shorthand';
import { Straight } from '@service/rank/predicate/straight';

const handFromShorthand = new HandFromShorthand();
const cardToShorthand = new CardToShorthand();

describe('Straight RankPredicate', () => {

  let straight: Straight;

  beforeEach(() => {
    straight = new Straight();
  });

  it('should not match with no cards', () => {
    expect(
      straight.is([])
    ).toBeFalsy();
  });

  describe('should not match', () => {

    [
      { input: '2C 3D 4C 5S 7H' },
      { input: '7H 5C 4S 3D 2D' },
      { input: '2H JD AC 7S QS' },
      { input: '2C TD 9H KD 8D' },
    ].forEach(({ input }) => {

      it(`with hand ${input}`, () => {
        expect(
          straight.is(new SortedHand(
            handFromShorthand.transform(input)
          ))
        ).toBeFalsy();
      });

    });

  });

  describe('should match', () => {

    [
      { input: '2H 5D AC 4S 3S' },
      { input: '2H 5D 6C 4S 3S' },
      { input: '2H 5H 6H 4H 3H' },
      { input: 'KC TD JD QS AS' },
    ].forEach(({ input }) => {

      it(`hand ${input}`, () => {
        expect(
          straight.is(
            handFromShorthand.transform(input)
          )
        ).toBeTruthy();
      });

    });

  });

  describe('should find none', () => {

    [
      { input: '' },
      { input: '2C 3D 4C 5S 7H' },
      { input: '7H 5C 4S 3D 2D' },
      { input: '2H JD AC 7S QS' },
      { input: '2C TD 9H KD 8D' },
      { input: '2H KD AC 4S 3S' },
    ].forEach(({ input }) => {

      it(`with hand ${input ? input : '[none]'}`, () => {
        expect(
          straight.find(new SortedHand(
            input ? handFromShorthand.transform(input) : []
          ))
        ).toEqual([]);
      });

    });

  });

  describe('should find cards ordered by rank', () => {

    [
      { input: '2H 5D AC 4S 3S', output: ['2H 5D AC 4S 3S'] },
      { input: '2H 5D 6C 4S 3S', output: ['2H 5D 6C 4S 3S'] },
      { input: '2H 5H 6H 4H 3H', output: ['2H 5H 6H 4H 3H'] },
      { input: 'KC TD JD QS AS', output: ['KC TD JD QS AS'] },
      { input: '2C 3D 5D 4C 6S AS', output: ['2C 3D 5D 4C 6S', '2C 3D 5D 4C AS'] },
    ].forEach(({ input, output }) => {

      it(`expecting hand ${input} to order ${output.join(' / ')}`, () => {
        expect(
          straight.find(
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
