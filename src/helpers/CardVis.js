import {StatVis} from "./StatVis";
import {selectStat} from "../components/views/Game";
import "styles/views/Game.scss";
import React from "react";

export const cardH = 150;
export const cardW = 100;
export const contourW = 5;
export const cornerRadius = 10;

const statPadding = 2;
const statCornerRadius = 2;

export const CardVis = ({transform, cardInfo, cardVisibility, selectedStat, isCurrentPlayed, hasWon, onClick, clickableStats}) => {

    const statHighlighting = (statName) => {
        let statStyle = {}; //Stat highlighting
        if (statName === selectedStat && isCurrentPlayed){
            if (hasWon){
                statStyle = {fill: "green", opacity: "50%"};
            }else
                statStyle = {fill: "white", opacity: "50%"};
        }
        if (clickableStats){
            statStyle = {cursor:"pointer"};
        }
        return statStyle;
    }

    const cardTitle = (
        <g>
            <path id="svg-text" d={`M ${cornerRadius-1.5*statPadding} ${2*cornerRadius-statPadding} H 94`} fill="transparent" stroke="transparent" />
            <text font-size="8.5" font-weight="bold">
                <textPath
                    xlinkHref="#svg-text"
                    method="stretch"
                    lengthAdjust="spacingAndGlyphs"
                >{cardInfo.cardname}</textPath>
            </text>
        </g>)

    const cardImage = [
        <defs>
            <rect id="rect" x={cornerRadius-statPadding} y={cornerRadius+13}
                  height={cardH/2-cornerRadius-13} width={80+2*statPadding}
                  rx={statCornerRadius}/>
            <clipPath id="clip">
                <use href="#rect"/>
            </clipPath>
        </defs>,
        <image href={cardInfo.image} x={cornerRadius-statPadding} y={cornerRadius+13}
               height={cardH/2-cornerRadius-13} width={80+2*statPadding}
               preserveAspectRatio="xMidYMid slice"
               clip-path="url(#clip)"
        />
    ]

    //     <img
    // src={cardInfo.image}
    // width="80%"
    //     ></img>

    const cardContent = ([
        cardTitle,
        cardImage,
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

                        <text className="game card value-name" x={cornerRadius} y={yStart + index*yStep + (7 + 2*statPadding)/7}>
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