import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {useParams} from 'react-router-dom';
import "styles/views/Lobby.scss";
import {getDomain} from 'helpers/getDomain';
import CardsSmall from '../../styles/graphics/CardsSmall.svg';
import EmptyPicture from '../../styles/graphics/EmptyPicture.svg';
import Deck from "models/Deck";

async function fetchPlayers(pathID, setPlayersFunc, setMaxFunc, setDeckIdFunc, playFunc, setHostIdFunc, code) {
    try {
        const requestOptions = {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
        };
        const response = await fetch(`${getDomain()}/session/${pathID}`, requestOptions);
        const data = await response.json();
        setPlayersFunc(data.userList);
        setHostIdFunc(data.hostId);
        await setMaxFunc(data.maxPlayers);
        console.log('in func: ', data.hasGame);
        if (data.hasGame) {
            playFunc(code);
        }

    } catch (error) {
        console.error(`Something went wrong while fetching the players: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the players! See the console for details.");
    }
}

async function getDeck(pathID, setDeckFunc, setHostIdFunc) {
    try {
        const requestOptions = {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
        };
        const firstResponse = await fetch(`${getDomain()}/session/${pathID}`, requestOptions);
        const firstData = await firstResponse.json();
        const deckId = firstData.deckId;
        setHostIdFunc(firstData.hostId);
        console.log('deck Id: ', deckId)

        const response = await fetch(`${getDomain()}/decks/${deckId}`, requestOptions);
        const data = await response.json();
        console.log('data: ', data);
        setDeckFunc(data);


    } catch (error) {
        console.error(`Something went wrong while fetching the deck: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the deck! See the console for details.");
    }
}

const Lobby = () => {
    const history = useHistory();
    // use react-router-dom's hook to access the history
    const userID = localStorage.getItem('UserID');
    const {pathID} = useParams();
    console.log(pathID);

    const [deck, setDeck] = useState(null);
    const [deckId, setDeckId] = useState(null);
    const [players, setPlayers] = useState(null);
    const [max, setMax] = useState(null);
    const [hostId, setHostId] = useState(null);
    //const [hasGame, setHasGame] = useState(Boolean);

    const leave = async () => {
      try {
        const requestOptions = {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
        };
        const response = await fetch(`${getDomain()}/session/leave/${pathID}`, requestOptions);

        history.push(`/menu`);
      } catch (error) {
        console.error(`Something went wrong while deleting the session: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while deleting the session! See the console for details.");
      }
    }

    const play = async (code) => {
      history.push(`play`);
    }

    const start = async () => {
      try {
        const requestOptions = {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
        };
        const response = await fetch(`${getDomain()}/session/${pathID}/game`, requestOptions);
        const data = await response.json();
        console.log(data);

        history.push(`play`);
      } catch (error) {
        console.error(`Something went wrong while starting the game: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while starting the game! See the console for details.");
      }
    }

    useEffect(() => {
      const interval = setInterval(() => {
          fetchPlayers(pathID, setPlayers, setMax, setDeckId, play, setHostId, pathID);
      }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      //getDeck(pathID, setDeck, setHostId);
    }, []);

    let content;
    let count;
    let playdeck;
    let buttons;

    if (players) {
      content = (
        <ul className="lobby player-list">
          {players.map(player => (
            <div className="player container">
              <p className="player name">{player}</p>
            </div>
          ))}
        </ul>
        );
        const numPlayers = players.length;
      count = (
        <p className="lobby dark">{numPlayers}/{max}</p>
      );
    }

    if (deck) {
      const numCards = deck.cardList.length;
      playdeck = (
        <div className="play-deck container">
          <img className="play-deck image" src={EmptyPicture} alt=''></img>
          <h2 className="play-deck title">{deck.deckname}</h2>
          <div className="play-deck cards">
            <p className="play-deck cards-num">{numCards}</p>
            <img className="play-deck card-icon" src={CardsSmall} alt=''></img>
          </div>
        </div>
      );
    }

    if (hostId == userID){
      buttons = (
        <div className="lobby button-container">
          <Button className="lobby cancel" onClick={() => leave()}>
            LEAVEE
          </Button>
          <Button className="lobby start" onClick={() => start()}>
            START GAME
          </Button>
        </div>
      );
    } else {
      buttons = (
        <div className="lobby button-container">
          <Button className="lobby cancel" onClick={() => leave()}>
            LEAVE
          </Button>
        </div>
      );
    }

    return (
        <BaseContainer className="lobby container">
          <div className="lobby left">
            <div className="lobby header">
              <p>Game Code:</p>
              <h2 className="lobby code">{pathID}</h2>
            </div>
            <div className="lobby players">
              <div className="lobby players-header">
                <p className="lobby dark">Players</p>
                {count}
              </div>
              <hr className="lobby hr rounded"/>
              {content}
            </div>
          </div>
          <div className="lobby right">
            {playdeck}
            {buttons}
          </div>
        </BaseContainer>
    );
}

export default Lobby;
