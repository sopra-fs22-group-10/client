import {useEffect, useState, useRef} from 'react';
import {handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import Tooltip from '@mui/material/Tooltip';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {useParams} from 'react-router-dom';
import "styles/views/Lobby.scss";
import {getDomain} from 'helpers/getDomain';
import CardsSmall from '../../styles/graphics/CardsSmall.svg';
import EmptyPicture from '../../styles/graphics/EmptyPicture.svg';
import Mute from '../../styles/graphics/mute.svg';
import Unmute from '../../styles/graphics/unmute.svg';
import Copy from '../../styles/graphics/copy.svg';
import lobbyMusic from '../../styles/music/Lobby_Music.mp3';

async function fetchPlayers(pathID, setPlayersFunc, setMaxFunc, setDeckIdFunc, playFunc, setHostIdFunc, code, setMin) {
    try {
        const requestOptions = {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
        };
        const response = await fetch(`${getDomain()}/session/${pathID}`, requestOptions);
        const data = await response.json();
        setPlayersFunc(data.userList);
        if (data.userList.length > 1 && data.userList.length < 7) {
          setMin(true);
        } else {
          setMin(false);
        }
        setHostIdFunc(data.hostId);
        await setMaxFunc(data.maxPlayers);
        if (data.hasGame) {
            playFunc(code);
        }

    } catch (error) {
        console.error(`Something went wrong while fetching the players: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the players! See the console for details.");
    }
}

async function getDeck(pathID, setDeckFunc, setHostIdFunc, setPicFunc) {
    try {
        const requestOptions = {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
        };
        const firstResponse = await fetch(`${getDomain()}/session/${pathID}`, requestOptions);
        const firstData = await firstResponse.json();
        const deckId = firstData.deckId;
        const deckaccesscode = firstData.deckaccesscode;
        setHostIdFunc(firstData.hostId);
        if(deckaccesscode != null){
          const requestOptions2 = {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication'), 'DeckAccessCode': deckaccesscode},
          };
          const response = await fetch(`${getDomain()}/decks/${deckId}`, requestOptions2)
          const data = await response.json();
        setDeckFunc(data);
        setPicFunc(data.deckImage);
;
            }
            else{const response = await fetch(`${getDomain()}/decks/${deckId}`, requestOptions);
            const data = await response.json();
            setDeckFunc(data);
            setPicFunc(data.deckImage);
    };


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

    const [deck, setDeck] = useState(null);
    const [deckId, setDeckId] = useState(null);
    const [players, setPlayers] = useState(null);
    const [max, setMax] = useState(null);
    const [hostId, setHostId] = useState(null);
    const [min, setMin] = useState(null);
    const [pic, setPic] = useState(EmptyPicture);

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

    const leave = async () => {
      try {
        const requestOptions = {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
        };
        const response = await fetch(`${getDomain()}/session/leave/${pathID}`, requestOptions);
        pauseAudio();
        history.push(`/menu`);
      } catch (error) {
        console.error(`Something went wrong while deleting the session: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while deleting the session! See the console for details.");
      }
    }

    const play = async (code) => {
      history.push(`play`);
      pauseAudio();
    }

    const copy = (code) => {
      console.log(code);
      let toCopy = JSON.stringify(code.pathID);
      navigator.clipboard.writeText(toCopy.slice(1, -1));
    }

    const start = async () => {
      try {
        const requestOptions = {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
        };
        const response = await fetch(`${getDomain()}/session/${pathID}/game`, requestOptions);
        const data = await response.json();
        pauseAudio();
        history.push(`play`);
      } catch (error) {
        console.error(`Something went wrong while starting the game: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while starting the game! See the console for details.");
      }
    }

    useEffect(() => {
      const interval = setInterval(() => {
          fetchPlayers(pathID, setPlayers, setMax, setDeckId, play, setHostId, pathID, setMin);
      }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        getDeck(pathID, setDeck, setHostId, setPic);
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
          <img className="play-deck image" src={pic} alt=''></img>
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
            LEAVE
          </Button>
          <Button className="lobby start"
          onClick={() => start()}
          disabled={!min}>
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
              <Tooltip title="Copy to clipboard" arrow>
                <img className="lobby mute" src={Copy} alt='' onClick={() => copy({pathID})}/>
              </Tooltip>
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
          <div className="lobby mute-container">
            <audio
              ref={myRef}
              src={lobbyMusic}
            />
            {audioStatus ? (
              <img className="lobby mute" src={Mute} alt='' onClick={pauseAudio}/>
            ) : (
              <img className="lobby mute" src={Unmute} alt='' onClick={startAudio}/>
            )}
            <div className="lobby right">
              {playdeck}
              {buttons}
            </div>
          </div>
        </BaseContainer>
    );
}

export default Lobby;
