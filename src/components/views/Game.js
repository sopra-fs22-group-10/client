import {useEffect, useState, useLayoutEffect, useRef} from 'react';
import {useHistory} from 'react-router-dom';
import "styles/views/Game.scss";
import {Button} from 'components/ui/Button';
import CloseX from "../../styles/graphics/CloseX.svg";
import helpQuestionmark from "../../styles/graphics/helpQuestionmark.svg";
import {handleError} from 'helpers/api';
import {HandVis} from "../../helpers/HandVis";
import {getHandTrans} from "../../helpers/HandPositioning";
import {useParams} from 'react-router-dom';
import {getDomain} from 'helpers/getDomain';
import Mute from '../../styles/graphics/muteGame.svg';
import Unmute from '../../styles/graphics/unmuteGame.svg';
import gameMusic from '../../styles/music/Game_Music.mp3';
import {testSession} from "../../models/TestEntities"; //TODO: remove

const delay = ms => new Promise(res => setTimeout(res, ms));

export const selectStat = async (statName) => {
    const pathID = localStorage.getItem('pathID');
    let currentStatName = statName;
    var currentPlayerId = 0;
    const playerId = localStorage.getItem('UserID');
    try {
        const requestOptions = {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
        };
        const response = await fetch(`${getDomain()}/session/${pathID}/game`, requestOptions);
        const data = await response.json();
        currentPlayerId = data.currentPlayer;
    } catch (error) {
         console.error(`Something went wrong while fetching game information: \n${handleError(error)}`);
         console.error("Details:", error);
         alert("Something went wrong while fetching game information! See the console for details.");
    }

    if (currentPlayerId == playerId){
        try {
            const requestBody = JSON.stringify({currentStatName});
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
    var currentPlayerId = 0;
    const playerId = localStorage.getItem('UserID');
    try {
        const requestOptions = {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
        };
        const response = await fetch(`${getDomain()}/session/${pathID}/game`, requestOptions);
        const data = await response.json();
        currentPlayerId = data.currentPlayer;
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

let showHelp = false;
const toggleHelp = () => {
    if (showHelp){showHelp = false}
    else {showHelp = true}
}

const help = () => {
    if (showHelp){
        return (
            <div className="game help-container">
                <h3 className="game help-text">
                    Goal
                </h3>
                <p className="game help-text" style={{"margin-top": "-13px"}}>
                    Players take turns comparing the card at the top of their card stack with others.
                    The player with the better card wins the compared cards and adds them to their stack.
                    To win the game a player must gather all of the cards.
                   </p>

                <h3 className="game help-text">
                    Instructions
                </h3>
                <p className="game help-text" style={{"margin-top": "-13px"}}>
                    1. The player whose turn it is selects an opponent to compare cards with. This is done by clicking on the opponents hand.

                </p>
                <p className="game help-text" style={{"margin-top": "-7px"}}>
                    2. The cards to be compared move to the center of the screen, with the current players cards being shown on the left and the opponents cards on the right.
                </p>
                <p className="game help-text" style={{"margin-top": "-7px"}}>
                    3. By clicking on a stat of the current played card, the active player selects which stat will be used for the comparison.
                </p>
                <p className="game help-text" style={{"margin-top": "-7px"}}>
                    4. The cards are compared. If both stats are the same, the active player and opponent stay the same and we go back to step 2. Otherwise the player with the better stat wins all of the compared cards and is the new active player. We go back to step 1.
                </p>
            </div>
        );
    }
}

const turnIndicator = (currentPlayer, opponentPlayer, playerList) => {
    if (opponentPlayer===null && currentPlayer!==null){
        if (currentPlayer===parseInt(localStorage.getItem('UserID'))){
            return (
                <div className="game help-container" style={{"background": "none", "border": "none"}}>
                    <h3 className="game help-text" style={{"text-align": "center"}}>
                        IT'S YOUR TURN!
                    </h3>
                    <p className="game help-text" style={{"text-align": "center", "margin-top": "-10px"}}>
                        choose an opponent by clicking on a hand
                    </p>
                </div>
            );
        } else {

            let currentPlayerName = "";
            for (const player of playerList) {
                if (player.playerId === currentPlayer){
                    currentPlayerName = player.playerName.toUpperCase();
                }
            }
            return (
                <div className="game help-container" style={{"background": "none", "border": "none"}}>
                    <h3 className="game help-text" style={{"text-align": "center"}}>
                        {currentPlayerName} IS CHOOSING AN OPPONENT
                    </h3>
                </div>
            )
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
    // use react-router-dom's hook to access the history
    const history = useHistory();
    const {pathID} = useParams();
    localStorage.setItem('pathID', pathID);
    var roundEnd = Boolean(false);
    var change = Boolean(false);
    const [session, setSession] = useState(testSession);
    var winnerName;
    var activePlayers = getActivePlayers(session.playerList);

    const [audioStatus, changeAudioStatus] = useState(false);
    const myRef = useRef();

    const startAudio = () => {
      myRef.current.play();
      myRef.current.loop = true;

      changeAudioStatus(true);
    };

    const pauseAudio = () => {
      myRef.current.pause();
      changeAudioStatus(false);
    };

    const quit = async () => {
      try {
        const requestOptions = {
                        method: 'DELETE',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
        };
        const response = await fetch(`${getDomain()}/session/${pathID}/game`, requestOptions);
        console.log('deleted game');
        localStorage.removeItem('pathID');
        pauseAudio();
        history.push(`/game/${pathID}/lobby`);
      } catch (error) {
        console.error(`Something went wrong while deleting the game: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while deleting the game! See the console for details.");
      }
    }

    const leave = async () => {
        pauseAudio();
        localStorage.removeItem('pathID');
        history.push(`/game/${pathID}/lobby`);
    }

    const lobby = async () => {
      try {
        const requestOptions = {
                        method: 'DELETE',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
        };
        const response = await fetch(`${getDomain()}/session/${pathID}/game`, requestOptions);
        console.log('deleted game');
        localStorage.removeItem('pathID');
      } catch (error) {
        console.error(`Something went wrong while deleting the game: \n${handleError(error)}`);
        console.error("Details:", error);
      }
        history.push(`/game/${pathID}/lobby`);
        pauseAudio();
    }

    useEffect(() => {
        async function fetchSession(pathID, setSessionFunc, leaveFunc){
            try {
                const requestOptions = {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
                };
                const response = await fetch(`${getDomain()}/session/${pathID}/game`, requestOptions);
                const data = await response.json();
                activePlayers = getActivePlayers(data.playerList);
                if (data.status == 404) {
                    leaveFunc();
                }
                await setSessionFunc(data);
            } catch (error) {
                 console.error(`Something went wrong while fetching game information: \n${handleError(error)}`);
                 console.error("Details:", error);
                 alert("Something went wrong while fetching game information! See the console for details.");
            }
        }
        const interval = setInterval(async () => {
            await fetchSession(pathID, setSession, leave);
        }, 500);
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
                hasWon={(activePlayers[i].playerId===session.currentPlayer && session.roundStatus==="win")
                || (activePlayers[i].playerId===session.opponentPlayer && session.roundStatus==="lost")}
                currentPlayer={session.currentPlayer}
                opponentPlayer={session.opponentPlayer}
            />
        );
    }
    let game;
    if(session.winner) {
        let winner = session.playerList.find(element => element.playerId === session.winner);
        winnerName = winner.playerName;
        game = (
          <div className="game container">
            <div className="game window">
              <h2>{winnerName} has won!</h2>
              <Button onClick={() => lobby()}>
                Back to Lobby
              </Button>
            </div>
          </div>
        );
    } else {
        game = (
          <div>
            {turnIndicator(session.currentPlayer, session.opponentPlayer, session.playerList)}
            {handVis}
          </div>
        );
    }

    return (
        <div className="game body">
            <img className="game close-icon" src={CloseX} alt="" onClick={() => quit()}></img>
            <img className="game help-icon" src={helpQuestionmark} alt="" onClick={() => toggleHelp()}></img>
            <audio
              ref={myRef}
              src={gameMusic}
            />
            {audioStatus ? (
              <img className="game mute" src={Mute} alt='' onClick={pauseAudio}/>
            ) : (
              <img className="game mute" src={Unmute} alt='' onClick={startAudio}/>
            )}

            {game}
            {help()}
        </div>
    );
}

export default Game;
