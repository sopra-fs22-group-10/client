import {CardVis} from "./CardVis";
import {cardWidth, getPlayedHandTrans} from "./HandPositioning";
import {getPlayedCardTransform, getCardTransform} from "./CardPositioning";

export const cardShift= 1/5*cardWidth;

const opponentID = 3; //TODO: get request
const activePlayerID = 2; //TODO: get request
const userID = 5; //TODO: get from local storage

export const HandVis = ({player, transform}) => {
    let handVis = [];
    let playedCardsVis = [];
    const hand = player.cards.hand;
    const playedCards = player.cards.playedCards;

    let cardVis = [];
    for (let cardIndex=0; cardIndex<hand.length; cardIndex++) {
        let card = hand[cardIndex];

        cardVis.push(
            <CardVis
                transform={getCardTransform({cardPos: cardIndex, cardAmount: hand.length})}
                cardInfo={card}
                cardVisibility={"hidden"}
            />);
    }

    handVis.push(
        <div className="game card-container" style={transform}>
            <h1 className="game card-container username">
                {player.username}
            </h1>
            {cardVis}
        </div>);

    //render played cards
    if ([activePlayerID, opponentID].includes(player.playerId)){
        for (let cardIndex=0; cardIndex<playedCards.length; cardIndex++) {//for the cards in the centre
            let card = playedCards[cardIndex];

            playedCardsVis.push(
                <CardVis
                    transform={getPlayedCardTransform({playerId: player.playerId, cardPos: cardIndex, cardAmount: playedCards.length})}
                    cardInfo={card}
                    cardVisibility={"shown"}
                />);
        }

        handVis.push(
            <div className="game card-container" style={getPlayedHandTrans(player.playerId)}>
                {playedCardsVis}
            </div>);
    }

    return handVis;
}