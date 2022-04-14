import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/DeckSelector.scss";
import {getDomain} from 'helpers/getDomain';
import CardsSmall from 'CardsSmall.svg';

const Deck = ({deck}) => (
  <div className="item container">
    <div className="item name">{deck.name}</div>
    <div className="item cards">{deck.cards}</div>
    <img className="item image" src={CardsSmall} alt=""></img>
  </div>
);

async function fetchUserDecks(userId, setDecksFunc) {
    try {
        const response = await api.get(`/decks/users/${userId}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // spinner delay
        setDecksFunc(response.data);

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

const DeckSelector = () => {
    const history = useHistory();
    // use react-router-dom's hook to access the history
    const userID = localStorage.getItem('UserID');

    const [decks, setDecks] = useState(null);
    const [deckId, setDeckId] = useState(null);

    const returnToDashboard = () => {
        history.push(`/game`);
    }

    const host = (deckId) => {
        history.push(`/game/123123/lobby`);
    }

    useEffect(() => {
        fetchUserDecks(userID, setDecks);
    }, []); //[dependencies]); to have it updated when any of the dependencies change

    let content;

    if (decks) {
      content = (
        <ul className="selector deck-list">
          {decks.map(deck => (
            <div onClick="setDeckId(deck.id);deck.checked = true;">
              <Deck
                deck={deck}
                key={deck.id}
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
              <Button
                onClick={() => host()}
              >
                Host Game
              </Button>
            </div>
            {content}
        </BaseContainer>
    );
}

export default DeckSelector;