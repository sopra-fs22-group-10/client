import {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import "styles/views/Game.scss";
import CloseX from "../../styles/graphics/CloseX.svg";
import CardDummy from "../../styles/graphics/CardDummy.svg";
import {handList} from "../../models/TestEntities";

const cardH = 150;
const cardW = 100;
const contourW = 5;


const Card = ({transform}) => (
    <svg xmlns="http://www.w3.org/2000/svg"
         width={cardW+2*contourW}
         height={cardH+2*contourW}
         viewBox={`-${contourW} -${contourW} ${cardW+contourW} ${cardH+contourW}`} //TODO: fix border
         style={transform}>

        <path d="
            M10,0
            A10,10 0 0,0 0,10
            V140
            A10,10 0 0,0 10,150
            H90
            A10,10 0 0,0 100,140
            V10
            A10,10 0 0,0 90,0
            Z"
            stroke-width={contourW}
            stroke="black"
            fill="#ff8b5d"/>

        <text x="20" y="35" className="small">Test</text>

    </svg>
    //<img className="game card-container image" src={CardDummy} alt="" style={transform} ></img>
);

const Hand = ({cards, transform}) => (
    <div id="cardContainer" className="game card-container" style={transform}>
        {cards}
    </div>
)

const Game = () => {

    // use react-router-dom's hook to access the history
    const history = useHistory();
    const [hands, setHands] = useState(handList);

    const quit = () => {
        history.push('/menu/');
    }

    const handWidth = 20;
    const cardWidth = 1/4*handWidth;
    const cardHeight = cardWidth*CardDummy.height/CardDummy.width;
    const cardShift= 1/5*cardWidth;

    const topBorder = 10;
    const bottomBorder = 10;
    const sideBorder = 10;
    const cornerRadius = 20;
    const sideLength = 100-(bottomBorder+topBorder+cornerRadius);
    const arcLength = cornerRadius*Math.PI/2;
    const topLength = 100-2*sideBorder-2*cornerRadius;
    const lineLength = 2*sideLength+2*arcLength+topLength;

    const getTrans = (linePos) => {
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
        return {x, y, rot};
    }

    const linePositions = [];
    for (let i = 1; i <= hands.length; i++) {
        linePositions.push(i*lineLength/(hands.length+1));
    }

    const handTransformations = [];
    for (const linePos of linePositions) {
        handTransformations.push(getTrans(linePos));
    }

    let handCode = [];
    for (let i = 0; i < hands.length; i++) {
        const hand = hands[i];
        const handTrans = handTransformations[i];

        let cardCode = [];
        for (const value of hand) {
            const cardTransform = {
                left: `${cardShift*value.pos + (handWidth-((hand.cardAmount()-1)*(cardShift)+cardWidth))/2}vw`,
                width: `${cardWidth}vw`,
                height: `${cardHeight}vw`
            }
            cardCode.push(<Card transform={cardTransform} />);
        }

        const handTransform = {
            left: `${handTrans.x-handWidth/2}vw`,
            top: `${handTrans.y}vh`,
            transform: `rotate(-${handTrans.rot}deg)`,
            width: `${handWidth}vw`,
            height: `${cardHeight}vw`
        }

        handCode.push(<Hand cards={cardCode} transform={handTransform} />);
    }

    let content = (
        <body className="game body">
            <div className="game close-container">
                <img className="game close-container" src={CloseX} alt="" onClick={() => quit()}></img>
            </div>
            {handCode}
        </body>);

    return (content);
}

export default Game;
