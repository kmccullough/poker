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

  const findCase = (
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

  const ffindCase = (
    description: string,
    RankType: Ranks.RankedHandConstructor,
    data: Array<{ input: string, output: string[] }>,
  ) => findCase(description, RankType, data, true);

  const xfindCase = (...a: any[]) => {};

  findCase('should find high cards', Ranks.HighCard, [
    { input: '2H', output: ['2H'] },
    { input: 'AH', output: ['AH'] },
    { input: 'KH 3H', output: ['KH', '3H'] },
    { input: '2H AH', output: ['AH', '2H'] },
  ]);

  findCase('should find one-pairs and high-cards', Ranks.OnePair, [
    { input: '2H 2D', output: ['2H 2D'] },
    { input: '2H 2D 3H', output: ['2H 2D', '3H'] },
    { input: '2H 3H 3C', output: ['3H 3C', '2H'] },
    { input: '2H 3H KD 3C', output: ['3H 3C', 'KD 2H'] },
  ]);

  findCase('should find two-pairs and high-cards', Ranks.TwoPair, [
    { input: '2H 2D 3H 3D', output: ['2H 2D 3H 3D'] },
    { input: '2H KC 2D 3H 3D', output: ['2H 2D 3H 3D', 'KC'] },
    { input: '2H KC 2D 3H KD 3D', output: ['KD KC 3H 3D', '2H 2D'] },
  ]);

  findCase('should find three-of-a-kinds and high-cards', Ranks.ThreeOfAKind, [
    { input: '2H 3C 3H 3D', output: ['3C 3H 3D', '2H'] },
    { input: '2H KC 2D 3H 2D', output: ['2H 2D 2D', 'KC 3H'] },
    { input: '2H KC KH 3H KD', output: ['KD KC KH', '3H 2H'] },
  ]);

  findCase('should find straights and high-cards', Ranks.Straight, [
    { input: '5D AH 2H 3C 4H', output: ['5D AH 2H 3C 4H'] },
    { input: '5D JD KD AH QD 2H 3C 4H', output: ['5D AH 2H 3C 4H', 'QD KD JD'] },
    { input: 'TD JD KD AH QD 2H 3C 4H', output: ['TD AH QD KD JD', '2H 3C 4H'] },
  ]);

  findCase('should find straights over two-pairs', Ranks.Straight, [
    { input: '5D AH 2H 2H 3C 3C 4D', output: ['5D AH 2H 3C 4D', '2H 3C'] },
  ]);

  findCase('should find straights over three-of-a-kind', Ranks.Straight, [
    { input: '5D AH 2H 2H 2H 3C 4D', output: ['5D AH 2H 3C 4D', '2H 2H'] },
  ]);

  findCase('should find flushes and high-cards', Ranks.Flush, [
    { input: '5H AH 2H 3H 6H', output: ['5H AH 2H 3H 6H'] },
    { input: '5H AH 2H 3H 6H 7D', output: ['5H AH 2H 3H 6H', '7D'] },
  ]);

  findCase('should find flushes over two-pairs', Ranks.Flush, [
    { input: '5H AH 2H 3H 6H 6D 3D', output: ['5H AH 2H 3H 6H', '6D 3D'] },
  ]);

  findCase('should find flushes over three-of-a-kind', Ranks.Flush, [
    { input: '5H AH 2H 3H 6H 6D 6C', output: ['5H AH 2H 3H 6H', '6D 6C'] },
  ]);

  findCase('should find flushes over straights', Ranks.Flush, [
    { input: '5H AH 2H 3H 6H 4D', output: ['5H AH 2H 3H 6H', '4D'] },
  ]);

  findCase('should find full-houses and high-cards', Ranks.FullHouse, [
    { input: '2H 2D 2C 3H 3C', output: ['2H 2D 2C 3H 3C'] },
    { input: '2H 2D KD 2C 7C 3H 3C', output: ['2H 2D 2C 3H 3C', 'KD 7C'] },
  ]);

  findCase('should find full-houses over straights', Ranks.FullHouse, [
    { input: '2H 2D 2C 3H 3C 4D 5H 6C', output: ['2H 2D 2C 3H 3C', '4D 5H 6C'] },
  ]);

  findCase('should find full-houses over flushes', Ranks.FullHouse, [
    { input: '2H 2H 2H 3H 3H', output: ['2H 2H 2H 3H 3H'] },
  ]);

  findCase('should find four-of-a-kinds and high-cards', Ranks.FourOfAKind, [
    { input: '2H 2H 2H 2H', output: ['2H 2H 2H 2H'] },
    { input: '2H 2H 5D 2H 2H', output: ['2H 2H 2H 2H', '5D'] },
  ]);

  findCase('should find four-of-a-kinds over straights', Ranks.FourOfAKind, [
    { input: '2H 2H 2H 2H 3D 4D 5D 6D', output: ['2H 2H 2H 2H', '3D 4D 5D 6D'] },
  ]);

  findCase('should find four-of-a-kinds over flushes', Ranks.FourOfAKind, [
    { input: '2H 2H 3H 2H 2H', output: ['2H 2H 2H 2H', '3H'] },
  ]);

  findCase('should find four-of-a-kinds over full-houses', Ranks.FourOfAKind, [
    { input: '2H 3C 2H 3D 2H 2H', output: ['2H 2H 2H 2H', '3D 3C'] },
  ]);

  findCase('should find straight-flushes and high-cards', Ranks.StraightFlush, [
    { input: 'AH 2H 3H 4H 5H', output: ['AH 2H 3H 4H 5H'] },
    { input: 'AH 2H 3H 4H 5H 7H', output: ['AH 2H 3H 4H 5H', '7H'] },
  ]);

  findCase('should find straight-flushes over full-houses', Ranks.StraightFlush, [
    { input: 'AH AH AH 2H 2H 3H 4H 5H', output: ['AH 2H 3H 4H 5H', 'AH AH 2H'] },
  ]);

  findCase('should find straight-flushes over four-of-a-kinds', Ranks.StraightFlush, [
    { input: 'AH AH AH AH 2H 3H 4H 5H', output: ['AH 2H 3H 4H 5H', 'AH AH AH'] },
  ]);

  findCase('should find five-of-a-kinds and high-cards', Ranks.FiveOfAKind, [
    { input: 'AH AD AC AS AH', output: ['AH AD AC AS AH'] },
    { input: 'AH AD 5D 7C AC AS AH', output: ['AH AD AC AS AH', '5D 7C'] },
  ]);

  findCase('should find five-of-a-kinds over full-houses', Ranks.FiveOfAKind, [
    { input: '2D 2C AH AD AC AS AH', output: ['AH AD AC AS AH', '2D 2C'] },
  ]);

  findCase('should find five-of-a-kinds over straight-flushes', Ranks.FiveOfAKind, [
    { input: '2H 3H 4H 5H AH AD AC AS AH', output: ['AH AD AC AS AH', '2H 3H 4H 5H'] },
  ]);

  const sortCase = (
    description: string,
    data: Array<{ input: [string, string], output: number }>,
    focus = false
  ) => {

    (focus ? fdescribe : describe)(description, () => {

      data.forEach(({ input, output }) => {

        it(`expecting winner from ${input.join(' / ')} to be `
            + (!output ? 'tie' : output < -1 ? 'left' : 'right'), () => {
          expect(
            fiveCardPoker.sort(
              toHand(input[0]),
              toHand(input[1])
            )
          ).toBe(output);
        });

      });

    });

  };

  const fsortCase = (
    description: string,
    data: Array<{ input: [string, string], output: number }>,
  ) => sortCase(description, data, true);

  const xsortCase = (...a: any[]) => {};

  sortCase('should sort high cards', [
    { input: ['2H', '3H'], output: 1 },
    { input: ['3H', '2H'], output: -1 },
    { input: ['2H', '2H'], output: 0 },
  ]);

  sortCase('should sort one-pairs', [
    { input: ['5H 5D', '4C 4H'], output: -1 },
    { input: ['4C 4H', '5H 5D'], output: 1 },
    { input: ['5H 5D', '5C 5H'], output: 0 },
    { input: ['5H 2C 5D', '5C 3C 5H'], output: 1 },
    { input: ['5H 3C 5D', '5C 2C 5H'], output: -1 },
    { input: ['5H 2C 5D', '5C 2C 5H'], output: 0 },
  ]);

  sortCase('should sort one-pairs over high-cards', [
    { input: ['5D', '4C 4H'], output: 1 },
    { input: ['4C 4H', '5D'], output: -1 },
  ]);

  sortCase('should sort two-pairs', [
    { input: ['5H 5D 6H 6D', '6C 6S 4C 4H'], output: -1 },
    { input: ['6H 6D 4C 4H', '5H 5D 6C 6S'], output: 1 },
    { input: ['5H 5D 6H 6D', '6C 6S 5C 5H'], output: 0 },
    { input: ['5H 5D 6H 6D 3C', '6C 6S 5C 5H 2C'], output: -1 },
    { input: ['5H 5D 6H 6D 2C', '6C 6S 5C 5H 3C'], output: 1 },
    { input: ['5H 5D 6H 6D 2C', '6C 6S 5C 5H 2C'], output: 0 },
  ]);

  sortCase('should sort two-pairs over one-pairs', [
    { input: ['5H 5D 6H 6D', '7C 7H'], output: -1 },
    { input: ['7C 7H', '5H 5D 6H 6D'], output: 1 },
  ]);

  sortCase('should sort three-of-a-kinds', [
    { input: ['5H 5D 5C', '6C 6S 6H'], output: 1 },
    { input: ['6C 6S 6H', '5H 5D 5C'], output: -1 },
    { input: ['5H 5D 5C', '5C 5S 5H'], output: 0 },
    { input: ['5H 5D 2H 5C', '5C 3D 5S 5H'], output: 1 },
    { input: ['5H 5D 3H 5C', '5C 2D 5S 5H'], output: -1 },
    { input: ['5H 5D 2H 5C', '5C 2D 5S 5H'], output: 0 },
  ]);

  sortCase('should sort three-of-a-kinds over two-pairs', [
    { input: ['5H 5D 5C', '6C 6S 4H 4C'], output: -1 },
    { input: ['6C 6S 4H 4C', '5H 5D 5C'], output: 1 },
  ]);

  sortCase('should sort straights', [
    { input: ['AH 2C 3D 4S 5H', 'AH TC JD QS KH'], output: 1 },
    { input: ['AH TC JD QS KH', 'AH 2C 3D 4S 5H'], output: -1 },
    { input: ['AH TC JD QS KH', 'AH TD JD QC KS'], output: 0 },
    { input: ['AH TC JD 7S QS KH', 'AH 6H TD JD QC KS'], output: -1 },
    { input: ['AH TC JD 6S QS KH', 'AH 7H TD JD QC KS'], output: 1 },
    { input: ['AH TC JD 6S QS KH', 'AH 6H TD JD QC KS'], output: 0 },
  ]);

  sortCase('should sort straights over two-pairs', [
    { input: ['2C 3D 4S 5H 6C', '7H 7S 8C 8D'], output: -1 },
    { input: ['7H 7S 8C 8D', '2C 3D 4S 5H 6C'], output: 1 },
  ]);

  sortCase('should sort straights over three-of-a-kind', [
    { input: ['2C 3D 4S 5H 6C', '7H 7S 7D'], output: -1 },
    { input: ['7H 7S 7D', '2C 3D 4S 5H 6C'], output: 1 },
  ]);

  sortCase('should sort flushes', [
    { input: ['AH 2H 7H 4H 5H', 'AC 2C 8C 4C 5C'], output: 1 },
    { input: ['AH 2H 8H 4H 5H', 'AC 2C 7C 4C 5C'], output: -1 },
    { input: ['AH 2H 7H 4H 5H', 'AC 2C 7C 4C 5C'], output: 0 },
    { input: ['AH 2H 7H 4H 5H 9S', 'AC 2C 7C 4C 5C TD'], output: 1 },
    { input: ['AH 2H 7H 4H 5H TS', 'AC 2C 7C 4C 5C 9D'], output: -1 },
    { input: ['AH 2H 7H 4H 5H TS', 'AC 2C 7C 4C 5C TS'], output: 0 },
  ]);

  sortCase('should sort flushes over two-pairs', [
    { input: ['AH 2H 7H 4H 5H', '8H 8D 9C 9S'], output: -1 },
    { input: ['8H 8D 9C 9S', 'AH 2H 7H 4H 5H'], output: 1 },
  ]);

  sortCase('should sort flushes over three-of-a-kinds', [
    { input: ['AH 2H 7H 4H 5H', '8H 8D 8C'], output: -1 },
    { input: ['8H 8D 8C', 'AH 2H 7H 4H 5H'], output: 1 },
  ]);

  sortCase('should sort flushes over straights', [
    { input: ['AH 2H 7H 4H 5H', 'AH 2H 6D 4H 5H'], output: -1 },
    { input: ['AH 2H 6D 4H 5H', 'AH 2H 7H 4H 5H'], output: 1 },
  ]);

  sortCase('should sort full-houses', [
    { input: ['5H 5D 5C 4H 4C', '3H 3D 3C 6H 6C'], output: 1 },
    { input: ['3H 3D 3C 6H 6C', '5H 5D 5C 4H 4C'], output: -1 },
    { input: ['3H 3D 3C 6H 6C', '7H 7D 7C 4H 4C'], output: 1 },
    { input: ['3H 3D 3C 6H 6C', '5H 5D 5C 6H 6C'], output: 1 },
    { input: ['3H 3D 3D 6S 6H', '3S 3D 3C 6D 6C'], output: 0 },
    { input: ['3H 3D 3D 6S 6H 7D', '3S 3D 3C 6D 6C 8S'], output: 1 },
    { input: ['3H 3D 3D 6S 6H 8D', '3S 3D 3C 6D 6C 7S'], output: -1 },
    { input: ['3H 3D 3D 6S 6H 8D', '3S 3D 3C 6D 6C 8S'], output: 0 },
  ]);

  sortCase('should sort full-houses over straights', [
    { input: ['5H 5D 5C 4H 4C', '2C 3D 4S 5H 6C'], output: -1 },
    { input: ['2C 3D 4S 5H 6C', '5H 5D 5C 4H 4C'], output: 1 },
  ]);

  sortCase('should sort full-houses over flushes', [
    { input: ['5H 5D 5C 4H 4C', '2C 3C 7C 5C 6C'], output: -1 },
    { input: ['2C 3C 7C 5C 6C', '5H 5D 5C 4H 4C'], output: 1 },
  ]);

  sortCase('should sort four-of-a-kinds', [
    { input: ['5H 5D 5C 5S', '6H 6D 6C 6S'], output: 1 },
    { input: ['6H 6D 6C 6S', '5H 5D 5C 5S'], output: -1 },
    { input: ['5H 5D 5C 5S', '5H 5D 5C 5S'], output: 0 },
    { input: ['5H 5D 5C 5S 9H', '5H 5D 5C 5S TC'], output: 1 },
    { input: ['5H 5D 5C 5S TH', '5H 5D 5C 5S 9C'], output: -1 },
    { input: ['5H 5D 5C 5S TH', '5H 5D 5C 5S TC'], output: 0 },
  ]);

  sortCase('should sort four-of-a-kinds over straights', [
    { input: ['5H 5D 5C 5S', '2C 3D 4S 5H 6C'], output: -1 },
    { input: ['2C 3D 4S 5H 6C', '5H 5D 5C 5S'], output: 1 },
  ]);

  sortCase('should sort four-of-a-kinds over flushes', [
    { input: ['5H 5D 5C 5S', '2C 3C 7C 5C 6C'], output: -1 },
    { input: ['2C 3C 7C 5C 6C', '5H 5D 5C 5S'], output: 1 },
  ]);

  sortCase('should sort four-of-a-kinds over full-houses', [
    { input: ['5H 5D 5C 5S', '5H 5D 5C 4H 4C'], output: -1 },
    { input: ['5H 5D 5C 4H 4C', '5H 5D 5C 5S'], output: 1 },
  ]);

  sortCase('should sort straight-flushes', [
    { input: ['AH 2H 3H 4H 5H', 'AC KC QC JC TC'], output: 1 },
    { input: ['AC KC QC JC TC', 'AH 2H 3H 4H 5H'], output: -1 },
    { input: ['AC KC QC JC TC', 'AS KS QS JS TS'], output: 0 },
    { input: ['AH 2H 3H 4H 5H 7C', 'AH 2H 3H 4H 5H 8H'], output: 1 },
    { input: ['AH 2H 3H 4H 5H 8C', 'AH 2H 3H 4H 5H 7H'], output: -1 },
    { input: ['AH 2H 3H 4H 5H 8C', 'AH 2H 3H 4H 5H 8H'], output: 0 },
  ]);

  sortCase('should sort straight-flushes over full-houses', [
    { input: ['AH 2H 3H 4H 5H', 'AC KC QC JC TC'], output: 1 },
  ]);

  sortCase('should sort straight-flushes over four-of-a-kinds', [
    { input: ['AH 2H 3H 4H 5H', '6H 6D 6C 7D 7C'], output: -1 },
    { input: ['6H 6D 6C 7D 7C', 'AH 2H 3H 4H 5H'], output: 1 },
  ]);

  sortCase('should sort five-of-a-kinds', [
    { input: ['5H 5D 5C 5S 5H', '6H 6D 6C 6H 6C'], output: 1 },
    { input: ['6H 6D 6C 6H 6C', '5H 5D 5C 5S 5H'], output: -1 },
    { input: ['6H 6D 6C 6H 6C', '6H 6D 6C 6H 6C'], output: 0 },
    { input: ['6H 6D 6C 6H 6C 7D', '6H 6D 6C 6H 6C 8C'], output: 1 },
    { input: ['6H 6D 6C 6H 6C 8D', '6H 6D 6C 6H 6C 7C'], output: -1 },
    { input: ['6H 6D 6C 6H 6C 8D', '6H 6D 6C 6H 6C 8C'], output: 0 },
  ]);

  sortCase('should sort five-of-a-kinds over full-houses', [
    { input: ['5H 5D 5C 5S 5H', '6H 6D 6C 3C 3D'], output: -1 },
    { input: ['6H 6D 6C 3C 3D', '5H 5D 5C 5S 5H'], output: 1 },
  ]);

  sortCase('should sort five-of-a-kinds over straight-flushes', [
    { input: ['5H 5D 5C 5S 5H', 'AC KC QC JC TC'], output: -1 },
    { input: ['AC KC QC JC TC', '5H 5D 5C 5S 5H'], output: 1 },
  ]);

});
