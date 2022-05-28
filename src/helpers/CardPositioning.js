import {cardHeight, cardWidth, handWidth, zoomScale} from "./HandPositioning";
import {cardShift} from "./HandVis";
import {ownHandScale} from "./HandPositioning";
import {isHovered} from "./cardHover";

export const getPlayedCardTransform = ({cardPos, cardAmount, isActive}) => {
    if (isActive) {
        return {
            right: `${zoomScale * (cardShift * (cardAmount-1-cardPos))}vw`,
            width: `${zoomScale * cardWidth}vw`,
            height: `${zoomScale * cardHeight}vw`
        };
    } else {
        return {
            left: `${zoomScale * (cardShift * (cardAmount-1-cardPos))}vw`,
            width: `${zoomScale * cardWidth}vw`,
            height: `${zoomScale * cardHeight}vw`
        };
    }
}

export const getCardTransform = ({cardPos, cardAmount, isClickable, isOwnHand, cardId}) => {
    let transform = {
        left: `${cardShift * (cardAmount - 1 - cardPos) + (handWidth - ((cardAmount - 1) * (cardShift) + cardWidth)) / 2}vw`,
        width: `${cardWidth}vw`,
        height: `${cardHeight}vw`
    };

    if (isOwnHand && isHovered(cardId)){
        transform = {
            left: `${cardShift * (cardAmount - 1 - cardPos) + (ownHandScale*handWidth - ((cardAmount - 1) * (cardShift) + ownHandScale*cardWidth)) / 2}vw`,
            width: `${ownHandScale*cardWidth}vw`,
            height: `${ownHandScale*cardHeight}vw`,
            "transform-origin": "bottom left",
            transform: `scale(${zoomScale},${zoomScale}) translateY(0.235vw) translateX(-.15vw)`
        };
    }

    if (isClickable){
        transform["cursor"]="pointer";
    }
    return transform;
}