import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {Redirect, useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/DeckSelector.scss";
import {getDomain} from 'helpers/getDomain';
import CardsSmall from '../../styles/graphics/CardsSmall.svg';
import AppRouter from "../routing/routers/AppRouter";

const Deck = ({deck}) => (
  <div className="item container" onClick={() => deck.checked = true}>
    <p className="item name">{deck.deckname}</p>
    <div className="item cards">{deck.cardList.length}</div>
    <img className="item image" src={CardsSmall} alt=""></img>
  </div>
);

async function fetchUserDecks(userID, setDecksFunc) {
    try {
        const requestOptions = {
                        method: 'GET',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
        };
        const response = await fetch(`${getDomain()}/decks/users/${userID}`, requestOptions);
        const data = await response.json();
        console.log('response is:', response);
        console.log('data is: ', data);

        data.forEach((item) => {
          console.log('ID: ' + item.deckId);
          console.log('NAME: ' + item.deckname);
        });

        setDecksFunc(data);

        // This is just some data for you to see what is available.
        //console.log('request to:', response.request.responseURL);
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

const DeckSelector = () => {
    const history = useHistory();
    // use react-router-dom's hook to access the history
    const userID = localStorage.getItem('UserID');

    const [decks, setDecks] = useState(null);
    const [deckId, setDeckId] = useState(null);

    const returnToDashboard = () => {
        history.push('/menu');
    }

    const host = async (deckId) => {
      try {
        let hostId = localStorage.getItem('UserID');
        let maxPlayers = 6;
        let hostUsername = localStorage.getItem('Username');
        const requestBody = JSON.stringify({deckId, hostId, maxPlayers, hostUsername});
        const requestOptions = {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
                        body: requestBody
        };
        const response = await fetch(`${getDomain()}/session/create`, requestOptions);
        await new Promise(resolve => setTimeout(resolve, 1000)); // spinner delay
        const gameData = await response.json();
        const gameCode = gameData.gameCode;
        history.push(`/game/${gameCode}/lobby`);

      } catch (error) {
        console.error(`Something went wrong while starting the session: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while starting the session! See the console for details.");
      }
    }

    useEffect(() => {
        fetchUserDecks(userID, setDecks);
    }, []); //[dependencies]); to have it updated when any of the dependencies change

    let content;

    if (decks) {
      content = (
        <ul className="selector deck-list">
          {decks.map(deck => (
            <div className="item case" onClick={() => host(deck.deckId)}>
              <Deck
                deck={deck}
                key={deck.deckId}
              >
              </Deck>
            </div>
          ))}
        </ul>
        );
    }

    return (
        <BaseContainer className="selector container">
            <h2>Select Deck</h2>
            <hr className="selector hr rounded"/>
            {content}
            <hr className="selector hr rounded"/>
            <div className="selector button-container">
              <Button
                onClick={() => returnToDashboard()}
              >
                Cancel
              </Button>
            </div>
        </BaseContainer>
    );
}

export default DeckSelector;
