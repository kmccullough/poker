import { Card, Suit } from '@model/card';
import { SortedHand } from '@model/sorted-hand';
import { CardToShorthand } from '@pipe/card-to-shorthand';
import { HandFromShorthand } from '@pipe/hand-from-shorthand';
import { HighCard } from '@service/rank/predicate/high-card';

const handFromShorthand = new HandFromShorthand();
const cardToShorthand = new CardToShorthand();

describe('HighCard RankPredicate', () => {

  let highCard: HighCard;

  beforeEach(() => {
    highCard = new HighCard();
  });

  it('should not match with no cards', () => {
    expect(
      highCard.is([])
    ).toBeFalsy();
  });

  it('should match with cards', () => {
    expect(
      highCard.is([new Card(2, Suit.Heart)])
    ).toBeTruthy();
  });

  it('should find none with no cards', () => {
    expect(
      highCard.find([])
    ).toEqual([]);
  });

  describe('should find cards ordered by rank', () => {

    [
      { input: '2C 3D 4C 5S 6H', output: '6H 5S 4C 3D 2C' },
      { input: '6H 5C 4S 3D 2D', output: '6H 5C 4S 3D 2D' },
      { input: '2H JD AC 7S QS', output: 'AC QS JD 7S 2H' },
      { input: '2C TD 9H KD 2D', output: 'KD TD 9H 2D 2C' },
    ].forEach(({ input, output }) => {

      it(`expecting hand ${input} to order ${output}`, () => {
        expect(
          highCard.find(new SortedHand(
            handFromShorthand.transform(input)
          )).map(
            c => cardToShorthand.transform(c.hand.cards[0])
          ).join(' ')
        ).toEqual(
          new SortedHand(
            handFromShorthand.transform(output)
          ).hand.cards.reverse()
              .map(c => cardToShorthand.transform(c))
              .join(' ')
        );
      });

    });

  });

});
