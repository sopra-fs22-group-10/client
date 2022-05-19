import {cardHeight, cardWidth, handWidth, zoomScale} from "./HandPositioning";
import {cardShift} from "./HandVis";

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

export const getCardTransform = ({cardPos, cardAmount, isClickable}) => {
    let transform = {
        left: `${cardShift * (cardAmount - 1 - cardPos) + (handWidth - ((cardAmount - 1) * (cardShift) + cardWidth)) / 2}vw`,
        width: `${cardWidth}vw`,
        height: `${cardHeight}vw`
    };
    if (isClickable){
        transform["cursor"]="pointer";
    }
    return transform;
}