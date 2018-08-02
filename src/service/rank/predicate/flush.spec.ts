import { SortedHand } from '@model/sorted-hand';
import { CardToShorthand } from '@pipe/card-to-shorthand';
import { HandFromShorthand } from '@pipe/hand-from-shorthand';
import { Flush } from '@service/rank/predicate/flush';

const handFromShorthand = new HandFromShorthand();
const cardToShorthand = new CardToShorthand();

describe('Flush RankPredicate', () => {

  let flush: Flush;

  beforeEach(() => {
    flush = new Flush();
  });

  it('should not match with no cards', () => {
    expect(
      flush.is([])
    ).toBeFalsy();
  });

  describe('should not match', () => {

    [
      { input: '2C 3D 4C 5S 6H' },
      { input: '6H 5C 4S 3D 2D' },
      { input: '2H JD AC 7S QS' },
      { input: '2C TC 9C KD 8C' },
    ].forEach(({ input }) => {

      it(`with hand ${input}`, () => {
        expect(
          flush.is(new SortedHand(
            handFromShorthand.transform(input)
          ))
        ).toBeFalsy();
      });

    });

  });

  describe('should match', () => {

    [
      { input: '2H AH AH 7H QH' },
      { input: '2C TC 9C KC KC' },
      { input: '2C 3D 4C 3C 2C 2D AC' },
      { input: '6D 5D 4C 2D TC 9C AD KC 4D 6C' },
    ].forEach(({ input }) => {

      it(`hand ${input}`, () => {
        expect(
          flush.is(
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
      { input: '2D TD 9H KD 8D' },
    ].forEach(({ input }) => {

      it(`with hand ${input ? input : '[none]'}`, () => {
        expect(
          flush.find(new SortedHand(
            input ? handFromShorthand.transform(input) : []
          ))
        ).toEqual([]);
      });

    });

  });

  describe('should find cards ordered by rank', () => {

    [
      { input: '2H AH AH 7H QH', output: ['2H AH AH 7H QH'] },
      { input: '2C TC 9C AC KC', output: ['2C TC 9C AC KC'] },
      { input: '2C 3D 4C 3C 2C 2D AC', output: ['2C 4C 3C 2C AC'] },
      { input: '6D 5D 4C 2D TC 9C AD KC 4D 6C', output: ['AD 6D 5D 4D 2D', 'KC TC 9C 6C 4C'] },
    ].forEach(({ input, output }) => {

      it(`expecting hand ${input} to order ${output.join(' / ')}`, () => {
        expect(
          flush.find(new SortedHand(
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
