import {StatVis} from "./StatVis";
import {selectStat} from "../components/views/Game";
import "styles/views/Game.scss";

export const cardH = 150;
export const cardW = 100;
export const contourW = 5;
export const cornerRadius = 10;

const statPadding = 2;
const statCornerRadius = 2;

export const CardVis = ({transform, cardInfo, cardVisibility, selectedStat, isCurrentPlayed, hasWon, onClick}) => {

    const statHighlighting = (statName) => {
        let statStyle = {}; //Stat highlighting
        if (statName === selectedStat && isCurrentPlayed){
            if (hasWon){
                statStyle = {fill: "green", opacity: "80%"};
            }else
                statStyle = {fill: "white", opacity: "80%"};
        }
        return statStyle;
    }

    const cardContent = ([
        <text className="game card title" x={6} y={17}>
            {cardInfo.cardname}
        </text>,

        cardInfo.cardstats.map(
            (stat, index) =>
                {
                    const yStart = (cardH/2 + 7+5);
                    const yStep = (cardH/2-2*contourW-7-5)/(cardInfo.cardstats.length-1);

                    let cardVis = [
                        <rect className="game card rect"
                              style={statHighlighting(stat.statname)}
                              onClick={() => selectStat(stat.statname)}
                              x={cornerRadius-statPadding} y={yStart + index*yStep - statPadding - 6}
                              width={cardW-2*cornerRadius+2*statPadding} height={7 + 2*statPadding}
                              rx={statCornerRadius} ry={statCornerRadius}/>,

                        <text className="game card value-name" x={cornerRadius} y={yStart + index*yStep}>
                            {stat.statname}
                        </text>];

                    cardVis.push(<StatVis stat={stat} yPos={yStart + index*yStep}/>);
                    return  cardVis;
                }
            )
        ]);

    const cardFront = (
        <svg xmlns="http://www.w3.org/2000/svg"
             width={cardW+2*contourW}
             height={cardH+2*contourW}
             viewBox={`-${contourW} -${contourW} ${cardW+2*contourW} ${cardH+2*contourW}`}
             style={transform}>

            <path d={`
                    M${cornerRadius},0
                    A${cornerRadius},${cornerRadius} 0 0,0 0,${cornerRadius}
                    V${cardH-cornerRadius}
                    A${cornerRadius},${cornerRadius} 0 0,0 ${cornerRadius},${cardH}
                    H${cardW-cornerRadius}
                    A${cornerRadius},${cornerRadius} 0 0,0 ${cardW},${cardH-cornerRadius}
                    V${cornerRadius}
                    A${cornerRadius},${cornerRadius} 0 0,0 ${cardW-cornerRadius},0
                    Z`}
                  strokeWidth={contourW}
                  className="card background"/>

            <path d={`
                M${cornerRadius},3
                A${cornerRadius},${cornerRadius} 0 0,0 3,${cornerRadius}
                V${cardH-cornerRadius}
                A${cornerRadius},${cornerRadius} 0 0,0 ${cornerRadius},${cardH-3}
                H${cardW-cornerRadius}
                A${cornerRadius},${cornerRadius} 0 0,0 ${cardW-3},${cardH-cornerRadius}
                V${cornerRadius}
                A${cornerRadius},${cornerRadius} 0 0,0 ${cardW-cornerRadius},3
                Z`}
                className="card stroke"/>

            {cardContent}
        </svg>
    );

    const cardBack = (
        <svg xmlns="http://www.w3.org/2000/svg"
            width={cardW+2*contourW}
            height={cardH+2*contourW}
            viewBox={`-${contourW} -${contourW} ${cardW+2*contourW} ${cardH+2*contourW}`}
            style={transform}
            onClick={onClick}>

            <path d={`
                    M${cornerRadius},0
                    A${cornerRadius},${cornerRadius} 0 0,0 0,${cornerRadius}
                    V${cardH-cornerRadius}
                    A${cornerRadius},${cornerRadius} 0 0,0 ${cornerRadius},${cardH}
                    H${cardW-cornerRadius}
                    A${cornerRadius},${cornerRadius} 0 0,0 ${cardW},${cardH-cornerRadius}
                    V${cornerRadius}
                    A${cornerRadius},${cornerRadius} 0 0,0 ${cardW-cornerRadius},0
                    Z`}
                  className="card background">
            </path>
            <path d={`
                M${cornerRadius},3
                A${cornerRadius},${cornerRadius} 0 0,0 3,${cornerRadius}
                V${cardH-cornerRadius}
                A${cornerRadius},${cornerRadius} 0 0,0 ${cornerRadius},${cardH-3}
                H${cardW-cornerRadius}
                A${cornerRadius},${cornerRadius} 0 0,0 ${cardW-3},${cardH-cornerRadius}
                V${cornerRadius}
                A${cornerRadius},${cornerRadius} 0 0,0 ${cardW-cornerRadius},3
                Z`}
                className="card stroke"/>
        </svg>
    );

    if (cardVisibility === "shown"){
        return cardFront;
    } else if (cardVisibility === "hidden"){
        return cardBack;
    }
}