import { Value } from '@model/card';
import { Sorter } from '@service/sort/sorter';

export interface ValueSorter extends Sorter {
  sort(a: Value, b: Value): number;
}

export const valueSortIndex: { [key: string]: number } = {
  // 2...9
  [Value.Ten]:   10,
  [Value.Jack]:  11,
  [Value.Queen]: 12,
  [Value.King]:  13,
  [Value.Ace]:   14,
};

export const valueIndex = (v: Value) => valueSortIndex[v] || v;

export class ValueSorter implements ValueSorter {

  sort(a: Value, b: Value): number {
    const av = valueIndex(a);
    const bv = valueIndex(b);
    return av < bv ? -1 : av > bv ? 1 : 0;
  }

}
