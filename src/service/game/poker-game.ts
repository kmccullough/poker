import { FullHand } from '@model/full-hand';
import { HighCardSortedHand } from '@model/high-card-sorted-hand';
import { RankedHandConstructor } from '@model/rank/ranks';
import { SortableHand, SortedHand } from '@model/sorted-hand';
import { HandPredicate } from '@service/game/hand-predicate';
import { RankPredicate, RankPredicateConstructor } from '@service/rank/predicate/predicates';
import { CardSorter } from '@service/sort/card-sorter';
import { HandSorter } from '@service/sort/hand-sorter';
import { Sorter } from '@service/sort/sorter';

export type RankConfig = [
  RankPredicateConstructor,
  RankedHandConstructor
];

export abstract class PokerGame implements HandPredicate, Sorter {
  // Predicates to test, in order
  protected predicates: RankPredicate[] = [];
  // Map from Object.getPrototypeOf(predicate) to appropriate ranked hand
  protected predicateRanks: Map<RankPredicateConstructor, RankedHandConstructor> = new Map();

  protected readonly handSorter: HandSorter;

  protected constructor(
    ranks: RankConfig[],
    handSorter?: HandSorter,
    protected readonly cardSorter: CardSorter = new CardSorter()
  ) {
    if (!handSorter) {
      handSorter = new HandSorter(ranks.map(r => r[1]));
    }
    this.handSorter = handSorter;
    this.predicates = [];
    ranks.forEach(config => {
      const [ Predicate, Rank ] = config;
      // Create usable predicates
      this.predicates.push(new Predicate());
      // Map used predicate class to rank class to instantiate
      this.predicateRanks.set(Predicate, Rank);
    });
  }

  is(hand: SortableHand): boolean {
    // There's at least a high card
    return SortedHand.wrap(hand).hand.cards.length > 0;
  }

  find(hand: SortableHand, max?: number): FullHand[] {
    const cards = SortedHand.wrap(hand).hand.cards;
    const hands: FullHand[] = [];
    this.predicates.every(predicate => {
      const results = predicate.find(hand, max)
        .map(h => {
          const Rank = this.predicateRanks.get(
            Object.getPrototypeOf(predicate).constructor
          )!;
          const ranked = new Rank(h);
          const rankedCards = h.hand.cards.slice();
          const other = new HighCardSortedHand(
            cards.filter(card => {
              const i = rankedCards.findIndex(c =>
                this.cardSorter.sort(card, c) === 0
              );
              if (i >= 0) {
                rankedCards.splice(i, 1);
              }
              return i < 0;
            })
          );
          return new FullHand(ranked, other);
        });
      hands.push(...results);
      return !max || hands.length < max;
    });
    return hands.slice(0, max || hands.length);
  }

  sort(a: SortableHand | FullHand, b: SortableHand | FullHand): number {
    a = a instanceof FullHand ? a : this.find(a, 1)[0];
    b = b instanceof FullHand ? b : this.find(b, 1)[0];
    return this.handSorter.sort(a, b);
  }

}
