export const Suit = {
  HEART: { value: 2, string: "H" },
  CLUB: { value: 3, string: "C" },
  DIAMOND: { value: 4, string: "D" },
  // spade always trumps other cards
  SPADE: { value: 5, string: "S" },
};

export const Rank = {
  TWO: { value: 2, string: "2" },
  THREE: { value: 3, string: "3" },
  FOUR: { value: 4, string: "4" },
  FIVE: { value: 5, string: "5" },
  SIX: { value: 6, string: "6" },
  SEVEN: { value: 7, string: "7" },
  EIGHT: { value: 8, string: "8" },
  NINE: { value: 9, string: "9" },
  TEN: { value: 10, string: "T" },
  JACK: { value: 11, string: "J" },
  QUEEN: { value: 12, string: "Q" },
  KING: { value: 13, string: "K" },
  ACE: { value: 14, string: "1" },
};

export class Card {
  constructor(card) {
    this.rank = Card.getRank(card);
    this.suit = Card.getSuit(card);
  }

  static getRank(card) {
    if (card[0] === "2") return Rank.TWO;
    if (card[0] === "3") return Rank.THREE;
    if (card[0] === "4") return Rank.FOUR;
    if (card[0] === "5") return Rank.FIVE;
    if (card[0] === "6") return Rank.SIX;
    if (card[0] === "7") return Rank.SEVEN;
    if (card[0] === "8") return Rank.EIGHT;
    if (card[0] === "9") return Rank.NINE;
    if (card[0] === "T") return Rank.TEN;
    if (card[0] === "J") return Rank.JACK;
    if (card[0] === "Q") return Rank.QUEEN;
    if (card[0] === "K") return Rank.KING;
    // Ace is always the highest value card
    if (card[0] === "1") return Rank.ACE;
  }

  static getSuit(card) {
    if (card[1] === "H") return Suit.HEART;
    if (card[1] === "C") return Suit.CLUB;
    if (card[1] === "D") return Suit.DIAMOND;
    if (card[1] === "S") return Suit.SPADE;
  }

  toString() {
    return this.rank.string + this.suit.string;
  }
}
