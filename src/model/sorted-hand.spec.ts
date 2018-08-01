import { Value } from '@src/model/card';
import { SortedHand } from '@src/model/sorted-hand';
import { HandFromShorthand } from '@src/pipe/hand-from-shorthand';

const handFromShorthand = new HandFromShorthand();

const cardKeys: { [key: string]: string } = {
  [Value.Ten]:   'T',
  [Value.Jack]:  'J',
  [Value.Queen]: 'Q',
  [Value.King]:  'K',
  [Value.Ace]:   'A',
};

describe('SortedHand model', () => {

  describe('should sort', () => {

    [
      { input: '2C 3D 4C 5S 6H', output: '23456' },
      { input: '6H 5C 4S 3D 2D', output: '23456' },
      { input: '2H JD AC 7S QS', output: '27JQA' },
      { input: '2C TD 9H KD 2D', output: '229TK' },
    ].forEach(({ input, output }) => {

      it(`hand ${input} to order ${output}`, () => {
        expect(
          new SortedHand(
            handFromShorthand.transform(input)
          ).hand.cards.map(
            c => cardKeys[c.value] || c.value
          ).join('')
        ).toEqual(
          output
        );
      });

    });

  });

});
