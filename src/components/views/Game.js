import {useEffect, useState, useLayoutEffect} from 'react';
import {useHistory} from 'react-router-dom';
import "styles/views/Game.scss";
import CloseX from "../../styles/graphics/CloseX.svg";
import {handleError} from 'helpers/api';
import {HandVis} from "../../helpers/HandVis";
import {getHandTrans} from "../../helpers/HandPositioning";
import {useParams} from 'react-router-dom';
import {getDomain} from 'helpers/getDomain';
import {testSession} from "../../models/TestEntities"; //TODO: remove

export const selectStat = async (statName) => {
    const pathID = localStorage.getItem('pathID');
    console.log(statName);
    var currentPlayerId = 0;
    const playerId = localStorage.getItem('userId');
    try {
        const requestOptions = {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
        };
        const response = await fetch(`${getDomain()}/session/${pathID}`, requestOptions);
        const data = await response.json();
        currentPlayerId = data.currentPlayerId;
    } catch (error) {
         console.error(`Something went wrong while fetching game information: \n${handleError(error)}`);
         console.error("Details:", error);
         alert("Something went wrong while fetching game information! See the console for details.");
    }
    if (currentPlayerId == playerId){
        try {
            const requestBody = JSON.stringify({statName});
            const requestOptions = {
                            method: 'PUT',
                            headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
                            body: requestBody
            };
            const response = await fetch(`${getDomain()}/session/${pathID}/round`, requestOptions);
        } catch (error) {
            console.error(`Something went wrong while fetching game information: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching game information! See the console for details.");
        }
    }
}

export const selectOpponent = async (opponentId) => {
    const pathID = localStorage.getItem('pathID');
    let opponentPlayer = opponentId;
    console.log(opponentId);
    var currentPlayerId = 0;
    const playerId = localStorage.getItem('userId');
    try {
        const requestOptions = {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
        };
        const response = await fetch(`${getDomain()}/session/${pathID}/game`, requestOptions);
        const data = await response.json();
        currentPlayerId = data.currentPlayer;
        console.log('currentId', currentPlayerId);
    } catch (error) {
         console.error(`Something went wrong while fetching game information: \n${handleError(error)}`);
         console.error("Details:", error);
         alert("Something went wrong while fetching game information! See the console for details.");
    }
    if (currentPlayerId == playerId){
        try {
            const requestBody = JSON.stringify({opponentPlayer});
            const requestOptions = {
                            method: 'PUT',
                            headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
                            body: requestBody
            };
            const response = await fetch(`${getDomain()}/session/${pathID}/round`, requestOptions);
            const data = await response.json();
            console.log('response for put opponent: ', data);
        } catch (error) {
            console.error(`Something went wrong while fetching game information: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching game information! See the console for details.");
        }
    }
}



const getActivePlayers = (playerList) => {
    const activePlayers = [];
    for (const player of playerList){
        if (player.playerStatus==="ACTIVE"){
            activePlayers.push(player);
        }
    }
    return activePlayers;
}

const Game = () => {
    //TODO handle inactive players

    // use react-router-dom's hook to access the history
    const history = useHistory();
    const {pathID} = useParams();
    localStorage.setItem('pathID', pathID);
    var roundEnd = Boolean(false);
    const UserId = localStorage.getItem('UserId');
    const [session, setSession] = useState(testSession);
    var activePlayers = getActivePlayers(session.playerList);

    const quit = async () => {
      try {
        const requestOptions = {
                        method: 'DELETE',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
        };
        const response = await fetch(`${getDomain()}/session/${pathID}/game`, requestOptions);
        console.log('deleted game');
        localStorage.removeItem('pathID');
        history.push(`/menu`);
      } catch (error) {
        console.error(`Something went wrong while deleting the game: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while deleting the game! See the console for details.");
      }
    }

    useEffect(() => {
        async function fetchSession(pathID, setSessionFunc){
            try {
                const requestOptions = {
                                method: 'GET',
                                headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
                };
                const response = await fetch(`${getDomain()}/session/${pathID}/game`, requestOptions);
                const data = await response.json();
                await setSessionFunc(data);
                activePlayers = getActivePlayers(session.playerList);
                console.log('active: ', activePlayers)


            } catch (error) {
                 console.error(`Something went wrong while fetching game information: \n${handleError(error)}`);
                 console.error("Details:", error);
                 alert("Something went wrong while fetching game information! See the console for details.");
            }
        }
        async function fetchSessionEnd(pathID, setSessionFunc){
            try {
                const requestOptions = {
                                method: 'GET',
                                headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
                };
                const response = await fetch(`${getDomain()}/session/${pathID}/round`, requestOptions);
                const data = await response.json();
                let newData = Object.assign({}, session);
                console.log('only new', newData);
                newData.assign(data);
                console.log('with new', newData)
                await setSessionFunc(newData);
            } catch (error) {
                 console.error(`Something went wrong while fetching game information: \n${handleError(error)}`);
                 console.error("Details:", error);
                 alert("Something went wrong while fetching round information! See the console for details.");
            }
        }

        const interval = setInterval(() => {
            if (roundEnd === true) {
              console.log('SessionEnd');
              fetchSessionEnd(pathID, setSession);
            } else {
              console.log('session normal');
              fetchSession(pathID, setSession);
            }
            console.log('session: ', session);
            roundEnd = (session.opponentPlayer != null);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

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
        <div className="game body">
        <div className="game close-container">
            <img className="game close-container" src={CloseX} alt="" onClick={() => quit()}></img>
        </div>
        {handVis}
        </div>
    );
}

export default Game;
