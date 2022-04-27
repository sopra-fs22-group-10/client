import {cardW, cornerRadius} from "./CardVis";

export const StatVis = ({stat, yPos}) => {
    let statVis = [];

    switch (stat.stattype){
        case "STARS":
            for (let i = 0; i < stat.statvalue; i++) {
                const starSize = 7;
                let xScale = 7/55.867;
                let yScale = 7/55.867;

                statVis.push(
                    <path fill="yellow" transform={`translate(${cardW-1.8*cornerRadius-i*starSize*1.05} ${yPos-starSize+1}) scale(${xScale} ${yScale})`}
                          d="M55.818,21.578c-0.118-0.362-0.431-0.626-0.808-0.681L36.92,18.268L28.83,1.876c-0.168-0.342-0.516-0.558-0.896-0.558
                                s-0.729,0.216-0.896,0.558l-8.091,16.393l-18.09,2.629c-0.377,0.055-0.689,0.318-0.808,0.681c-0.117,0.361-0.02,0.759,0.253,1.024
                                l13.091,12.76l-3.091,18.018c-0.064,0.375,0.09,0.754,0.397,0.978c0.309,0.226,0.718,0.255,1.053,0.076l16.182-8.506l16.18,8.506
                                c0.146,0.077,0.307,0.115,0.466,0.115c0.207,0,0.413-0.064,0.588-0.191c0.308-0.224,0.462-0.603,0.397-0.978l-3.09-18.017
                                l13.091-12.761C55.838,22.336,55.936,21.939,55.818,21.578z"
                    />
                );
            }
            break;

        case "NUMBER":
            statVis.push(
                <text className="game card value" x={cardW - cornerRadius} y={yPos}>
                    {stat.statvalue} {stat.valuestypes}
                </text>
            );
            break;

        case "VALUE":
            break; //TODO: how should this visualised?

        default:
            break;
    }
    return statVis;
}