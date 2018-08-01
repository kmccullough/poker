export enum Value {
  Ace = 1,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack,
  Queen,
  King
}

export enum Suit {
  Heart,
  Diamond,
  Club,
  Spade
}

export class Card {
  constructor(
    public readonly value: Value,
    public readonly suit: Suit
  ) {

  }
}
