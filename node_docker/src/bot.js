import { Card, Rank, Suit } from "./card.js";

function parseCardArr(cards) {
  return cards.map((card) => new Card(card));
}

function sameSuit(card1, card2) {
  return card1.suit.value === card2.suit.value;
}

/**
 * @param played Cards that have been played this hand
 * @returns The highest rank card that has been played of the same suit as the first played card.
 * If card of another rank has been played then that is not returned.
 */
function getHighestPlayedCard(played) {
  let highestCard = played[0];
  for (let i = 1; i < played.length; i++) {
    const card = played[i];
    if (
      sameSuit(card, highestCard) &&
      card.rank.value > highestCard.rank.value
    ) {
      highestCard = card;
    }
  }
  return highestCard;
}

/**
 *
 * @param played Cards that have been played this hand
 * @param cards Own cards
 * @returns A valid card based on cards that have been played.
 */
export function getPlayCard(playedStrArr, cardsStrArr) {
  const played = parseCardArr(playedStrArr);
  const cards = parseCardArr(cardsStrArr);

  // First turn is ours or we have won last hand.
  // Throw the first card in hand.
  // TODO: maybe play Ace or King here
  if (played.length === 0) {
    return cards[0];
  }

  let selectedCard, validCard;
  let highestCard = getHighestPlayedCard(played);

  // select higher card of same suit
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    if (sameSuit(card, highestCard)) {
      if (card.rank.value > highestCard.rank.value) {
        selectedCard = card;
      } else {
        validCard = card;
      }
    }
  }
  // card of same suit exists but not higher than played
  if (!selectedCard && validCard) {
    // TODO: maybe play a low-rank card if no winning card exists
    selectedCard = validCard;
  }

  // no card of same suit found; use spade
  if (!selectedCard) {
    // check first is other players have played spade card
    let opponentSpade;
    played.forEach((card) => {
      if (card.suit === Suit.SPADE) {
        opponentSpade = card;
      }
    });

    // If opponents have played spade card, play winning spade card
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (card.suit === Suit.SPADE) {
        if (opponentSpade) {
          if (card.rank.value > opponentSpade.rank.value) {
            selectedCard = card;
            break;
          }
        } else {
          // TODO: maybe play a low-rank spade card if opponents have not played spade
          selectedCard = card;
          break;
        }
      }
    }
  }
  // no spade card in hand; use any card
  if (!selectedCard) {
    // TODO: maybe play a low-rank card if no winning card exists
    selectedCard = cards[0];
  }

  return selectedCard;
}

export function getBid(cardsStrArr) {
  const cards = parseCardArr(cardsStrArr);
  // TODO: maybe count the number of other cards and spades as well

  let count = 0;
  // count aces and king and use that as bid value
  for (let i = 0; i < cards.length; i++) {
    let card = cards[i];
    if (card.rank === Rank.ACE || card.rank === Rank.KING) {
      count += 1;
    }
  }

  // 8 is max allowed bid
  count = count > 8 ? 8 : count;
  // 1 is minimum bid
  return Math.max(1, count);
}
