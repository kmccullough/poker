import { Card, Suit } from '@model/card';
import { Hand } from '@model/hand';
import { HighCardSortedHand } from '@model/high-card-sorted-hand';
import * as Ranks from '@model/rank/ranks';
import { SortableHand, SortedHand } from '@model/sorted-hand';
import { CardToShorthand } from '@pipe/card-to-shorthand';
import { HandFromShorthand } from '@pipe/hand-from-shorthand';
import { FiveCardPoker } from '@service/game/five-card-poker';

const cardToShorthand = new CardToShorthand();
const handFromShorthand = new HandFromShorthand();

const fromHand = (cards: SortableHand): string =>
  SortedHand.wrap(cards).hand.cards
    .map(c => cardToShorthand.transform(c))
    .join(' ');

const toHand = (cards: string): Hand =>
  handFromShorthand.transform(cards);

const sortHand = (cards: string | SortableHand): string =>
  fromHand(
    SortedHand.wrap(
      typeof cards === 'string'
        ? handFromShorthand.transform(cards)
        : cards
    ).hand
  );

const highSortHand = (cards: string | SortableHand): string =>
  fromHand(
    HighCardSortedHand.wrap(
      typeof cards === 'string'
        ? handFromShorthand.transform(cards)
        : cards
    ).hand
  );

describe('FiveCardPoker game', () => {

  let fiveCardPoker: FiveCardPoker;

  beforeEach(() => {
    fiveCardPoker = new FiveCardPoker();
  });

  it('should not match with no cards', () => {
    expect(
      fiveCardPoker.is([])
    ).toBeFalsy();
  });

  it('should match with cards', () => {
    expect(
      fiveCardPoker.is([new Card(2, Suit.Heart)])
    ).toBeTruthy();
  });

  it('should find none with no cards', () => {
    expect(
      fiveCardPoker.find([])
    ).toEqual([]);
  });

  const testCase = (
    description: string,
    RankType: Ranks.RankedHandConstructor,
    data: Array<{ input: string, output: string[] }>,
    focus = false
  ) => {

    (focus ? fdescribe : describe)(description, () => {

      data.forEach(({ input, output }) => {

        it(`expecting hand ${input} to order ${output.join(' / ')}`, () => {
          const fullHand = fiveCardPoker.find(toHand(input), 1)[0];
          expect(fullHand).toBeTruthy();
          expect(
            fullHand.ranked
          ).toEqual(jasmine.any(RankType));
          expect(
            sortHand(fullHand.ranked)
          ).toEqual(
            sortHand(output[0])
          );
          expect(
            highSortHand(fullHand.other.hand)
          ).toEqual(
            !output[1] ? '' : highSortHand(output[1])
          );
        });

      });

    });

  };

  const ftestCase = (
    description: string,
    RankType: Ranks.RankedHandConstructor,
    data: Array<{ input: string, output: string[] }>,
  ) => testCase(description, RankType, data, true);

  const xtestCase = (...a: any[]) => {};

  testCase('should find high cards', Ranks.HighCard, [
    { input: '2H', output: ['2H'] },
    { input: 'AH', output: ['AH'] },
    { input: 'KH 3H', output: ['KH', '3H'] },
    { input: '2H AH', output: ['AH', '2H'] },
  ]);

  testCase('should find one-pairs and high-cards', Ranks.OnePair, [
    { input: '2H 2D', output: ['2H 2D'] },
    { input: '2H 2D 3H', output: ['2H 2D', '3H'] },
    { input: '2H 3H 3C', output: ['3H 3C', '2H'] },
    { input: '2H 3H KD 3C', output: ['3H 3C', 'KD 2H'] },
  ]);

  testCase('should find two-pairs and high-cards', Ranks.TwoPair, [
    { input: '2H 2D 3H 3D', output: ['2H 2D 3H 3D'] },
    { input: '2H KC 2D 3H 3D', output: ['2H 2D 3H 3D', 'KC'] },
    { input: '2H KC 2D 3H KD 3D', output: ['KD KC 3H 3D', '2H 2D'] },
  ]);

  testCase('should find three-of-a-kinds and high-cards', Ranks.ThreeOfAKind, [
    { input: '2H 3C 3H 3D', output: ['3C 3H 3D', '2H'] },
    { input: '2H KC 2D 3H 2D', output: ['2H 2D 2D', 'KC 3H'] },
    { input: '2H KC KH 3H KD', output: ['KD KC KH', '3H 2H'] },
  ]);

  testCase('should find straights and high-cards', Ranks.Straight, [
    { input: '5D AH 2H 3C 4H', output: ['5D AH 2H 3C 4H'] },
    { input: '5D JD KD AH QD 2H 3C 4H', output: ['5D AH 2H 3C 4H', 'QD KD JD'] },
    { input: 'TD JD KD AH QD 2H 3C 4H', output: ['TD AH QD KD JD', '2H 3C 4H'] },
  ]);

  testCase('should find straights over one-pairs', Ranks.Straight, [
    { input: '5D AH 2H 2H 3C 4D', output: ['5D AH 2H 3C 4D', '2H'] },
  ]);

  testCase('should find straights over two-pairs', Ranks.Straight, [
    { input: '5D AH 2H 2H 3C 3C 4D', output: ['5D AH 2H 3C 4D', '2H 3C'] },
  ]);

  testCase('should find straights over three-of-a-kind', Ranks.Straight, [
    { input: '5D AH 2H 2H 2H 3C 4D', output: ['5D AH 2H 3C 4D', '2H 2H'] },
  ]);

  testCase('should find flushes and high-cards', Ranks.Flush, [
    { input: '5H AH 2H 3H 6H', output: ['5H AH 2H 3H 6H'] },
    { input: '5H AH 2H 3H 6H 7D', output: ['5H AH 2H 3H 6H', '7D'] },
  ]);

  testCase('should find flushes over one-pairs', Ranks.Flush, [
    { input: '5H AH 2H 3H 6H 6D', output: ['5H AH 2H 3H 6H', '6D'] },
  ]);

  testCase('should find flushes over two-pairs', Ranks.Flush, [
    { input: '5H AH 2H 3H 6H 6D 3D', output: ['5H AH 2H 3H 6H', '6D 3D'] },
  ]);

  testCase('should find flushes over three-of-a-kind', Ranks.Flush, [
    { input: '5H AH 2H 3H 6H 6D 6C', output: ['5H AH 2H 3H 6H', '6D 6C'] },
  ]);

  testCase('should find flushes over straights', Ranks.Flush, [
    { input: '5H AH 2H 3H 6H 4D', output: ['5H AH 2H 3H 6H', '4D'] },
  ]);

  testCase('should find full-houses and high-cards', Ranks.FullHouse, [
    { input: '2H 2D 2C 3H 3C', output: ['2H 2D 2C 3H 3C'] },
    { input: '2H 2D KD 2C 7C 3H 3C', output: ['2H 2D 2C 3H 3C', 'KD 7C'] },
  ]);

  testCase('should find full-houses over straights', Ranks.FullHouse, [
    { input: '2H 2D 2C 3H 3C 4D 5H 6C', output: ['2H 2D 2C 3H 3C', '4D 5H 6C'] },
  ]);

  testCase('should find full-houses over flushes', Ranks.FullHouse, [
    { input: '2H 2H 2H 3H 3H', output: ['2H 2H 2H 3H 3H'] },
  ]);

});
