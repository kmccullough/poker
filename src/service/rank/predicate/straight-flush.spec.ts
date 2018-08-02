import { SortedHand } from '@model/sorted-hand';
import { CardToShorthand } from '@pipe/card-to-shorthand';
import { HandFromShorthand } from '@pipe/hand-from-shorthand';
import { StraightFlush } from '@service/rank/predicate/straight-flush';

const handFromShorthand = new HandFromShorthand();
const cardToShorthand = new CardToShorthand();

describe('StraightFlush RankPredicate', () => {

  let straightFlush: StraightFlush;

  beforeEach(() => {
    straightFlush = new StraightFlush();
  });

  it('should not match with no cards', () => {
    expect(
      straightFlush.is([])
    ).toBeFalsy();
  });

  describe('should not match', () => {

    [
      { input: '2C 3D 4C 5S 6H' },
      { input: '6H 5C 4S 3D 2D' },
      { input: '2H JD AC 7S QS' },
      { input: '2C TD 9H KD 8D' },
      { input: '2H 5D AC 4S 3S' },
      { input: '2H 5D 6C 4S 3S' },
      { input: '2C 3D 5D 4C 6S AS' },
      { input: '2H AH AH 7H QH' },
      { input: '2C TC 9C AC KC' },
      { input: '2C 3D 4C 3C 2C 2D AC' },
      { input: '6D 5D 4C 2D TC 9C AD KC 4D 6C' },
    ].forEach(({ input }) => {

      it(`with hand ${input}`, () => {
        expect(
          straightFlush.is(new SortedHand(
            handFromShorthand.transform(input)
          ))
        ).toBeFalsy();
      });

    });

  });

  describe('should match', () => {

    [
      { input: '2D 5D AD 4D 3D' },
      { input: '2C 5C 6C 4C 3C' },
      { input: '2H 5H 6H 4H 3H' },
      { input: '2H 2S 4C 3S 5S 4S 6D AS' },
    ].forEach(({ input }) => {

      it(`hand ${input}`, () => {
        expect(
          straightFlush.is(
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
      { input: '6H 5C 4S 3D 2D' },
      { input: '2H JD AC 7S QS' },
      { input: '2C TD 9H KD 8D' },
      { input: '2H 5D AC 4S 3S' },
      { input: '2H 5D 6C 4S 3S' },
      { input: '2C 3D 5D 4C 6S AS' },
      { input: '2H AH AH 7H QH' },
      { input: '2C TC 9C AC KC' },
      { input: '2C 3D 4C 3C 2C 2D AC' },
      { input: '6D 5D 4C 2D TC 9C AD KC 4D 6C' },
    ].forEach(({ input }) => {

      it(`with hand ${input ? input : '[none]'}`, () => {
        expect(
          straightFlush.find(new SortedHand(
            input ? handFromShorthand.transform(input) : []
          ))
        ).toEqual([]);
      });

    });

  });

  describe('should find cards ordered by rank', () => {

    [
      { input: '2D 5D AD 4D 3D', output: ['2D 5D AD 4D 3D'] },
      { input: '2C 5C 6C 4C 3C', output: ['2C 5C 6C 4C 3C'] },
      { input: '2H 5H 6H 4H 3H', output: ['2H 5H 6H 4H 3H'] },
      { input: '2H 2S 4C 3S 5S 4S 6D AS', output: ['2S 3S 4S 5S AS'] },
    ].forEach(({ input, output }) => {

      it(`expecting hand ${input} to order ${output.join(' / ')}`, () => {
        expect(
          straightFlush.find(new SortedHand(
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
