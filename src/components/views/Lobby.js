import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {useParams} from 'react-router-dom';
import "styles/views/Lobby.scss";
import {getDomain} from 'helpers/getDomain';
import CardsSmall from 'CardsSmall.svg';
import EmptyPicture from 'EmptyPicture.svg';

const Player = ({player}) => (
  <div className="item container">
    <div className="item name">{player.name}</div>
  </div>
);

async function fetchPlayers(userId, setPlayersFunc) {
    try {
        const response = await api.get(`/decks/users/${userId}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // spinner delay
        setPlayersFunc(response.data);

        // This is just some data for you to see what is available.
        console.log('request to:', response.request.responseURL);
        console.log('status code:', response.status);
        console.log('status text:', response.statusText);
        console.log('requested data:', response.data);
        console.log(response);
    } catch (error) {
        console.error(`Something went wrong while fetching the decks: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the decks! See the console for details.");
    }
}

const Lobby = () => {
    const history = useHistory();
    // use react-router-dom's hook to access the history
    const userID = localStorage.getItem('UserID');
    const {pathID} = useParams();

    const [deck, setDecks] = useState(null);
    const [players, setPlayers] = useState(null);

    //temp
    //const [numPlayers, setNumPlayers] = useState(null);
    const numPlayers = 2;
    const deckTitle = "gud cars";
    const numCards = "15";

    const endSession = () => {
        history.push(`/game`);
    }

    const start = () => {
    }

    useEffect(() => {
        fetchPlayers(userID, setPlayers);
    }, []); //[dependencies]); to have it updated when any of the dependencies change

    let content;

    if (players) {
      content = (
        <ul className="lobby player-list">
          {players.map(player => (
              <Player
                Player={player}
                key={player.id}
              >
              </Player>
          ))}
        </ul>
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
                <p className="lobby dark">{numPlayers}/6</p>
              </div>
              <hr className="lobby hr rounded"/>
            </div>
          </div>
          <div className="lobby right">
            <div className="deck container">
              <img className="deck image" src={EmptyPicture} alt=''></img>
              <h2 className="deck title">{deckTitle}</h2>
              <div className="deck cards">
                <p className="deck cards-num">{numCards}</p>
                <img className="deck card-icon" src={CardsSmall} alt=''></img>
              </div>
            </div>
            <div className="lobby button-container">
              <Button className="lobby cancel" onClick={() => endSession()}>
                CANCEL
              </Button>
              <Button className="lobby start" onClick={() => start()}>
                START GAME
              </Button>
            </div>
          </div>
        </BaseContainer>
    );
}

export default Lobby;
