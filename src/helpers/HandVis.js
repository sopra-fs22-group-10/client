import {CardVis} from "./CardVis";
import {cardHeight, cardWidth, getPlayedHandTrans, handWidth, zoomScale} from "./HandPositioning";
import {getPlayedCardTransform, getCardTransform} from "./CardPositioning";
import {selectOpponent} from "../components/views/Game";

export const cardShift= 1/5*cardWidth;

const userId = parseInt(localStorage.getItem('UserID'));

export const HandVis = ({player, transform, selectedStat, hasWon, currentPlayer, opponentPlayer}) => {
    let handVis = [];
    let playedCardsVis = [];
    const hand = player.hand;
    const hasPlayedCards = [currentPlayer, opponentPlayer].includes(player.playerId);
    const playedCards = player.playedCards;

    let cardVis = [];
    for (let cardIndex=hand.length-1; cardIndex>=0; cardIndex--) {
        let card = hand[cardIndex];

        let cardVisibility = "hidden"
        if (cardIndex===0 && player.playerId===userId && (!hasPlayedCards || opponentPlayer===null)){
            cardVisibility = "shown"
        }

        cardVis.push(
            <CardVis
                transform={getCardTransform({
                    cardPos: cardIndex,
                    cardAmount: hand.length,
                    isClickable: userId===currentPlayer && player.playerId!==currentPlayer && opponentPlayer===null,
                    isOwnHand: userId===player.playerId,
                    cardId: card.cardId
                    })}
                cardInfo={card}
                cardVisibility={cardVisibility}
                selectedStat={selectedStat}
                isCurrentPlayed={false}
                hasWon={hasWon}
                onClick={opponentPlayer===null? () => selectOpponent(player.playerId):null}
            />);
    }

    var usernameStyle = {};
    if (player.playerId===opponentPlayer){
        //usernameStyle = {"text-shadow": "0px 0px 10px #FF8B5D, 0px 0px 10px #FF8B5D, 0px 0px 10px yellow"};
    } else if (player.playerId===currentPlayer){
        //usernameStyle = {"text-shadow": "0px 0px 10px white, 0px 0px 10px white, 0px 0px 10px white"};
    }

    handVis.push(
        <div className="game card-container" style={transform}>
            <h1 className="game card-container username" style={usernameStyle}>
                {player.playerId===userId && currentPlayer!==null? (player.playerName + " (you)"):player.playerName}
            </h1>
            {cardVis}
        </div>);

    //render played cards
    if (hasPlayedCards){

        for (let cardIndex=0; cardIndex<playedCards.length; cardIndex++) {//for the cards in the centre
            let card = playedCards[cardIndex];

            let cardVisibility = "hidden"
            if (cardIndex!==playedCards.length-1 || [userId, currentPlayer].includes(player.playerId) || !(selectedStat===null || typeof selectedStat === 'undefined')){
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
                                         clickableStats={userId===currentPlayer && cardIndex===playedCards.length-1}
                                         hasWon={hasWon}
            />);
        }

        handVis.push(
            <div className="game played-card-container" style={getPlayedHandTrans(player.playerId, currentPlayer, opponentPlayer)}>
                <h1 className="game played-card-container username" style={player.playerId===currentPlayer? {"margin-right": "3vw", "text-align": "right"}:{"margin-left": "3vw", "text-align": "left"}}>
                    {opponentPlayer!==null? (player.playerId===userId? "YOU":player.playerName.toUpperCase()):null}
                </h1>
                {playedCardsVis}
            </div>);
    }

    //show vs text
    if (opponentPlayer!=null)handVis.push(
        <div className="game played-card-container" style={{left: `${50}vw`, top: `${50.7-zoomScale*cardHeight}vh`}}>
            <h1 className="game played-card-container username" style={{"margin-left": "-1.4vw"}}>
                VS
            </h1>
        </div>)

    return handVis;
}