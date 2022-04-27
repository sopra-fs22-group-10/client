import {useState} from 'react';
import {useHistory} from 'react-router-dom';
import "styles/views/Game.scss";
import CloseX from "../../styles/graphics/CloseX.svg";
import {HandVis} from "../../helpers/HandVis";
import {getHandTrans} from "../../helpers/HandPositioning";
import {testSession} from "../../models/TestEntities"; //TODO: remove

export const selectStat = (statName) => {
    console.log(statName);
    //TODO add stat selection request, make it only work for userId === currentPlayerId
}

export const selectOpponent = (opponentId) => {
    console.log(opponentId);
    //TODO add opponent selection request, make it only work for userId === currentPlayerId
}

const getActivePlayers = (playerList) => {
    const activePlayers = [];
    for (const player of playerList){
        if (player.playerStatus==="active"){
            activePlayers.push(player);
        }
    }
    return activePlayers;
}

const Game = () => {
    //TODO handle inactive players

    // use react-router-dom's hook to access the history
    const history = useHistory();
    const quit = () => {
        history.push('/menu/');
    }

    const [session, setSession] = useState(testSession); //TODO: use GET
    const activePlayers = getActivePlayers(session.playerList);

    //Generate code for Hand visualisation
    let handVis = [];
    const handTransformations = getHandTrans(activePlayers);
    for (let i=0; i<activePlayers.length; i++) {
        handVis.push(
            <HandVis
                key={i}
                player={activePlayers[i]}
                transform={handTransformations[i]}
                selectedStat={session.currentStatName}
                hasWon={activePlayers[i].playerId===session.currentPlayer && session.roundStatus==="win"
                        || activePlayers[i].playerId===session.opponentPlayer && session.roundStatus==="lost"}
                currentPlayer={session.currentPlayer}
                opponentPlayer={session.opponentPlayer}
            />
        );
    }

    return (
        <body className="game body">
        <div className="game close-container">
            <img className="game close-container" src={CloseX} alt="" onClick={() => quit()}></img>
        </div>
        {handVis}
        </body>
    );
}

export default Game;
