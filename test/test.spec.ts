import { SortableHand, SortedHand } from '@model/sorted-hand';
import { CardToShorthand } from '@pipe/card-to-shorthand';
import { HandFromShorthand } from '@pipe/hand-from-shorthand';
import { RoundFromShorthand } from '@pipe/round-from-shorthand';
import { FiveCardPoker } from '@service/game/five-card-poker';

// Can't seem to get this loading from the @assets alias
import sampleInput from '../assets/sampleinput.txt';
const inputs = sampleInput.trim().split(/[\r\n]+/);
import sampleOutput from '../assets/sampleoutput.txt';
const outputs = sampleOutput.trim().split(/[\r\n]+/);

const cardToShorthand = new CardToShorthand();
const handFromShorthand = new HandFromShorthand();
const roundFromShorthand = new RoundFromShorthand();

const fromHand = (cards: SortableHand): string =>
  SortedHand.wrap(cards).hand.cards
    .map(c => cardToShorthand.transform(c))
    .join(' ');

const sortHand = (cards: string | SortableHand): string =>
  fromHand(
    SortedHand.wrap(
      typeof cards === 'string'
        ? handFromShorthand.transform(cards)
        : cards
    ).hand
  );

const teamNames = [
  'Black',
  'White',
];

const displayResult = (n: number) =>
  !n ? 'Tie.' : `${teamNames[n < 0 ? 0 : 1]} wins.`;

describe('Test data file', () => {

  let fiveCardPoker: FiveCardPoker;

  beforeEach(() => {
    fiveCardPoker = new FiveCardPoker();
  });

  describe('should match hand ranking', () => {

    inputs.forEach((input, i) => {

      const output = outputs[i];

      const [ a, b ] = roundFromShorthand.transform(input).hands;
      const ah = sortHand(a.cards);
      const bh = sortHand(b.cards);

      it(`round ${i + 1} expecting winner from ${ah} / ${bh} to be ${output}`, () => {
        expect(
          displayResult(
            fiveCardPoker.sort(a, b)
          )
        ).toBe(output);
      });

    });

  });

});
