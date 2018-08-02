import { SortedHand } from '@model/sorted-hand';
import { CardToShorthand } from '@pipe/card-to-shorthand';
import { HandFromShorthand } from '@pipe/hand-from-shorthand';
import { FullHouse } from '@service/rank/predicate/full-house';

const handFromShorthand = new HandFromShorthand();
const cardToShorthand = new CardToShorthand();

describe('FullHouse RankPredicate', () => {

  let fullHouse: FullHouse;

  beforeEach(() => {
    fullHouse = new FullHouse();
  });

  it('should not match with no cards', () => {
    expect(
      fullHouse.is([])
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
          fullHouse.is(new SortedHand(
            handFromShorthand.transform(input)
          ))
        ).toBeFalsy();
      });

    });

  });

  describe('should match', () => {

    [
      { input: 'AH AD AC 7S 7S' },
      { input: '9C TD 9H TC TD' },
      { input: '2C 3D 3C 3S 2H' },
      { input: '6H 6C JS 6D JD' },
      { input: '6H 6C JS 6D JD JC' },
    ].forEach(({ input }) => {

      it(`hand ${input}`, () => {
        expect(
          fullHouse.is(
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
          fullHouse.find(new SortedHand(
            input ? handFromShorthand.transform(input) : []
          ))
        ).toEqual([]);
      });

    });

  });

  describe('should find cards ordered by rank', () => {

    [
      { input: 'AH AD AC 7S 7S', output: ['AH AD AC 7S 7S'] },
      { input: '9C TD 9H TC TD', output: ['9C TD 9H TC TD'] },
      { input: '2C 3D 3C 3S 2H', output: ['2C 3D 3C 3S 2H'] },
      { input: '6H 6C JS 6D JD', output: ['6H 6C JS 6D JD'] },
      { input: '6H 6C JS 6D JD JC', output: ['JS JD JC 6H 6C', '6H 6C 6D JS JD'] },
    ].forEach(({ input, output }) => {

      it(`expecting hand ${input} to order ${output.join(' / ')}`, () => {
        expect(
          fullHouse.find(new SortedHand(
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
