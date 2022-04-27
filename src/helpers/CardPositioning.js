import {cardHeight, cardWidth, handWidth, zoomScale} from "./HandPositioning";
import {cardShift} from "./HandVis";
import {card} from "../models/TestEntities";

const opponentID = 3; //TODO: get request
const activePlayerID = 2; //TODO: get request
const userID = 5; //TODO: get from local storage

export const getPlayedCardTransform = ({playerId, cardPos, cardAmount}) => {
    //cardPos = 0; //TODO revert
    if (playerId === activePlayerID) {
        return {
            right: `${zoomScale * (cardShift * (cardAmount-1-cardPos))}vw`,
            width: `${zoomScale * cardWidth}vw`,
            height: `${zoomScale * cardHeight}vw`
        };
    } else if (playerId === opponentID) {
        return {
            left: `${zoomScale * (cardShift * (cardAmount-1-cardPos))}vw`,
            width: `${zoomScale * cardWidth}vw`,
            height: `${zoomScale * cardHeight}vw`
        };
    }
}

export const getCardTransform = ({cardPos, cardAmount}) => {
    return {
        left: `${cardShift*cardPos + (handWidth-((cardAmount-1)*(cardShift)+cardWidth))/2}vw`,
        width: `${cardWidth}vw`,
        height: `${cardHeight}vw`}
}