import { SortedHand } from '@model/sorted-hand';
import { CardToShorthand } from '@pipe/card-to-shorthand';
import { HandFromShorthand } from '@pipe/hand-from-shorthand';
import { OnePair } from '@service/rank/predicate/one-pair';

const handFromShorthand = new HandFromShorthand();
const cardToShorthand = new CardToShorthand();

describe('OnePair RankPredicate', () => {

  let onePair: OnePair;

  beforeEach(() => {
    onePair = new OnePair();
  });

  it('should not match with no cards', () => {
    expect(
      onePair.is([])
    ).toBeFalsy();
  });

  describe('should not match', () => {

    [
      { input: '2C 3D 4C 5S 6H' },
      { input: '6H 5C 4S 3D 2D' },
      { input: '2H JD AC 7S QS' },
      { input: '2C TD 9H KD 8D' },
    ].forEach(({ input }) => {

      it(`with hand ${input}`, () => {
        expect(
          onePair.is(new SortedHand(
            handFromShorthand.transform(input)
          ))
        ).toBeFalsy();
      });

    });

  });

  describe('should match', () => {

    [
      { input: '2H AD AC 7S QS' },
      { input: '2C TD 9H KC KD' },
      { input: '2C 3D 4C 3S 2H' },
      { input: '6H 5C 4S 5D 6D' },
      { input: '6H 6H 6H' },
    ].forEach(({ input }) => {

      it(`hand ${input}`, () => {
        expect(
          onePair.is(
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
    ].forEach(({ input }) => {

      it(`with hand ${input ? input : '[none]'}`, () => {
        expect(
          onePair.find(new SortedHand(
            input ? handFromShorthand.transform(input) : []
          ))
        ).toEqual([]);
      });

    });

  });

  describe('should find cards ordered by rank', () => {

    [
      { input: '2H AD AC 7S QS', output: ['AD AC'] },
      { input: '2C TD 9H KC KD', output: ['KC KD'] },
      { input: '2C 3D 4C 3S 2H', output: ['3D 3S', '2C 2H'] },
      { input: '6H 5C 4S 5D 6D', output: ['6H 6D', '5C 5D'] },
      { input: '6H 6H 6H', output: ['6H 6H'] },
    ].forEach(({ input, output }) => {

      it(`expecting hand ${input} to order ${output.join(' / ')}`, () => {
        expect(
          onePair.find(new SortedHand(
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
