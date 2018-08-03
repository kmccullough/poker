import * as Rank from '@model/rank/ranks';
import { PokerGame } from '@service/game/poker-game';
import * as RankPredicate from '../rank/predicate/predicates';

export class FiveCardPoker extends PokerGame {

  constructor() {
    super([
      [RankPredicate.FiveOfAKind,   Rank.FiveOfAKind],
      [RankPredicate.StraightFlush, Rank.StraightFlush],
      [RankPredicate.FourOfAKind,   Rank.FourOfAKind],
      [RankPredicate.FullHouse,     Rank.FullHouse],
      [RankPredicate.Flush,         Rank.Flush],
      [RankPredicate.Straight,      Rank.Straight],
      [RankPredicate.ThreeOfAKind,  Rank.ThreeOfAKind],
      [RankPredicate.TwoPair,       Rank.TwoPair],
      [RankPredicate.OnePair,       Rank.OnePair],
      [RankPredicate.HighCard,      Rank.HighCard]
    ]);
  }

}
