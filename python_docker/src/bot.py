from logging.config import valid_ident
from typing import List

from card import Card, RANK, SUIT


def parse_card_arr(cards: List[Card]):
    return [Card(card) for card in cards]


def same_suit(card1: Card, card2: Card):
    return card1.suit["value"] == card2.suit["value"]


def get_highest_played_card(played: List[Card]):
    highestCard = played[0]
    for i in range(1, len(played)):
        card = played[i]
        if (
            same_suit(card, highestCard)
            and card.rank["value"] > highestCard.rank["value"]
        ):
            highestCard = card

    return highestCard


def get_play_card(played_str_arr: List[str], cards_str_arr: List[str]):
    played_cards = parse_card_arr(played_str_arr)
    cards = parse_card_arr(cards_str_arr)

    # First turn is ours or we have won last hand.
    # Throw the first card in hand.
    # TODO: maybe play Ace or King here
    if len(played_cards) == 0:
        return cards[0]

    selected_card, valid_card = None, None
    highest_card = get_highest_played_card(played_cards)
    # select higher card of same suit
    for card in cards:
        if same_suit(card, highest_card):
            if card.rank["value"] > highest_card.rank["value"]:
                selected_card = card
            else:
                valid_card = card

    # card of same suit exists but not higher than played
    if selected_card is None and valid_card is not None:
        # TODO: maybe play a low-rank card if no winning card exists
        selected_card = valid_card

    # no card of same suit found; use spade
    if selected_card is None:
        opponent_spade = None
        # check first is other players have played spade card
        for card in played_cards:
            if card.suit == SUIT["SPADE"]:
                opponent_spade = card

        for card in cards:
            if opponent_spade:
                if card.rank["value"] > opponent_spade.rank["value"]:
                    selected_card = card
                    break
            else:
                # TODO: maybe play a low-rank spade card if opponents have not played spade
                selected_card = card
                break

    # no spade card in hand; use any card
    if selected_card is None:
        # TODO: maybe play a low-rank card if no winning card exists
        selected_card = cards[0]

    return selected_card


def get_bid(cardsStrArr: List[str]):
    cards = parse_card_arr(cardsStrArr)

    # TODO: maybe count the number of other cards and spades as well
    count = 0
    # count aces and king and use that as bid value
    for card in cards:
        if card.rank == RANK["ACE"] or card.rank == RANK["KING"]:
            count += 1

    # 8 is maximum allowed bid
    count = count if count < 8 else 8
    # 1 is minimum allowed bid
    return max(1, count)
