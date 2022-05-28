//get Transformation variables for other players hands
import {cardH, cardW} from "./CardVis";

//Hand/Card variables
export const handWidth = 20;
export const cardWidth = 1/4*handWidth;
export const cardHeight = cardWidth*cardH/cardW;
export const zoomScale = 3;

const userId = parseInt(localStorage.getItem("UserID"));

const topBorder = 5;
const bottomBorder = 5;
const sideBorder = 5;
const cornerRadius = 30;
const sideLength = 100-(bottomBorder+topBorder+cornerRadius);
const arcLength = cornerRadius*Math.PI/2;
const topLength = 100-2*sideBorder-2*cornerRadius;
const lineLength = 2*sideLength+2*arcLength+topLength;

const getTransformation = (linePos) => {
    let x = sideBorder; // set start position
    let y = 100-bottomBorder;
    let rot = 0;
    if (linePos < sideLength){
        y -= linePos;
        rot = 90;
    } else if (linePos < sideLength+arcLength){
        let angle = 2*Math.PI*(linePos-sideLength)/(4*arcLength);
        x += (1-Math.cos(angle))*cornerRadius;
        y = topBorder+(1-Math.sin(angle))*cornerRadius;
        rot = 90-angle/(2*Math.PI)*360;
    } else if (linePos < sideLength+arcLength+topLength){
        x = sideBorder+cornerRadius+(linePos-sideLength-arcLength);
        y = topBorder;
    } else if (linePos < sideLength+2*arcLength+topLength){
        let angle = 2*Math.PI*(linePos-sideLength-arcLength-topLength)/(4*arcLength);
        x = sideBorder+cornerRadius*(1+Math.sin(angle))+topLength;
        y = topBorder+(1-Math.cos(angle))*cornerRadius;
        rot = 360-angle/(2*Math.PI)*360;
    } else if (linePos <= lineLength){
        x = 100-sideBorder;
        y -= (lineLength-linePos);
        rot = 360-90;
    }

    let handTransform = {
        left: `${x-handWidth/2}vw`,
        top: `${y}vh`,
        transform: `rotate(-${rot}deg)`,
        width: `${handWidth}vw`, height: `${cardHeight}vw`}
    return handTransform;
}

export const ownHandScale = 1;
const ownHandTrans = {
    left: `${50-ownHandScale*handWidth/2}vw`,
    top: `${100-bottomBorder-window.innerWidth/window.innerHeight*ownHandScale*cardHeight}vh`,
    width: `${ownHandScale*handWidth}vw`,
    height: `${ownHandScale*cardHeight}vw`};

const oppPlayedTrans = {
    right: `${50-handWidth}vw`,
    top: `${50.7-zoomScale*cardHeight}vh`,
    width: `${handWidth}vw`,
    height: `${zoomScale*cardHeight}vw`};
const activePlayedTrans = {
    left: `${50-handWidth}vw`,
    top: `${50.7-zoomScale*cardHeight}vh`,
    width: `${handWidth}vw`,
    height: `${zoomScale*cardHeight}vw`};

export const getHandTrans = (playerList, UserID) => {

    const linePositions = [];
    for (let i = 1; i <= playerList.length-1; i++) {
        linePositions.push(i*lineLength/(playerList.length));
    }

    const transformations = [];
    let linePosIndex = 0;
    for (const player of playerList) {
        let transformation = null;
        if (player.playerId === userId) {
            transformation = ownHandTrans;
        } else {
            transformation = getTransformation(linePositions[linePosIndex])
            linePosIndex ++;
        }
        transformations.push(transformation);
    }
    return transformations;
}

export const getPlayedHandTrans = (playerId, currentPlayer, opponentPlayer) => {
    if (playerId === currentPlayer){
        return activePlayedTrans;
    } else if (playerId === opponentPlayer){
        return oppPlayedTrans;
    }
}
