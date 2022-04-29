import {CardVis} from "./CardVis";
import {cardWidth, getPlayedHandTrans} from "./HandPositioning";
import {getPlayedCardTransform, getCardTransform} from "./CardPositioning";
import {selectOpponent} from "../components/views/Game";

export const cardShift= 1/5*cardWidth;

const userID = 5; //TODO: get from local storage

export const HandVis = ({player, transform, selectedStat, hasWon, currentPlayer, opponentPlayer}) => {
    let handVis = [];
    let playedCardsVis = [];
    const hand = player.cards.hand;
    const hasPlayedCards = [currentPlayer, opponentPlayer].includes(player.playerId);
    const playedCards = player.cards.playedCards;

    let cardVis = [];
    for (let cardIndex=0; cardIndex<hand.length; cardIndex++) {
        let card = hand[cardIndex];

        let cardVisibility = "hidden"
        if (cardIndex===hand.length-1 && player.playerId===userID && !hasPlayedCards){
            cardVisibility = "shown"
        }

        cardVis.push(
            <CardVis
                transform={getCardTransform({cardPos: cardIndex, cardAmount: hand.length})}
                cardInfo={card}
                cardVisibility={cardVisibility}
                selectedStat={selectedStat}
                isCurrentPlayed={false}
                hasWon={hasWon}
                onClick={() => selectOpponent(player.playerId)}
            />);
    }

    var usernameStyle = {};
    if (player.playerId===opponentPlayer){
        usernameStyle = {"text-shadow": "0px 0px 10px #FF8B5D, 0px 0px 10px #FF8B5D, 0px 0px 10px #FF8B5D"};
    } else if (player.playerId===currentPlayer){
        usernameStyle = {"text-shadow": "0px 0px 10px white, 0px 0px 10px white, 0px 0px 10px white"};
    }

    handVis.push(
        <div className="game card-container" style={transform}>
            <h1 className="game card-container username" style={usernameStyle}>
                {player.username}
            </h1>
            {cardVis}
        </div>);

    //render played cards
    if (hasPlayedCards){

        for (let cardIndex=0; cardIndex<playedCards.length; cardIndex++) {//for the cards in the centre
            let card = playedCards[cardIndex];

            let cardVisibility = "hidden"
            if (cardIndex!==playedCards.length-1 || [userID, currentPlayer].includes(player.playerId) || selectedStat!==null){ //TODO fix if null is returned as string
                cardVisibility = "shown"
            }

            playedCardsVis.push(<CardVis className="game played-card"
                                         transform={getPlayedCardTransform({
                                             isActive: player.playerId===currentPlayer,
                                             cardPos: cardIndex,
                                             cardAmount: playedCards.length})
                                         }
                                         cardInfo={card}
                                         cardVisibility={cardVisibility}
                                         selectedStat={selectedStat}
                                         isCurrentPlayed={cardIndex===playedCards.length-1}
                                         hasWon={hasWon}
            />);
        }

        handVis.push(
            <div className="game card-container" style={getPlayedHandTrans(player.playerId, currentPlayer, opponentPlayer)}>
                {playedCardsVis}
            </div>);
    }

    return handVis;
}