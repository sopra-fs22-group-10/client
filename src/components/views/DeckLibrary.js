import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import "styles/views/DeckLibrary.scss";

const DeckLibrary = () => {
  const history = useHistory();

  // objects for test
  const [decks, setDecks] = useState([]);

  const toDashboard = () => {
    history.push('/menu');
  }
  const toPublic = () => {
    history.push('/menu');
  }
  const createNewDeck = () => {
    history.push(`/menu/createDeck`);
  }
  function viewDeck(deckId){
    history.push(`/menu/deckOverview/${deckId}`);
  }


  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const userId = localStorage.getItem('UserID');
        let response = response = await api.get('/users/'+userId);

        // Get the returned users and update the state.
        setDecks(response.data.deckList);

        // See here to get more data.
        console.log(response);
        } catch (error) {
        console.error(`Something went wrong: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong! See the console for details.");
      }
    }

    fetchData();
  }, []);

  const DeckBlock = ({deck}) => (
    <div className="deck container">
      <div className="deck image-container">
      </div>
      <div className="deck content-container">
        <div className="deck text-container">
          <h3 className="deck title">{deck.deckname}</h3>
          <h5 className="deck creator">Status: {deck.deckstatus}</h5>
        </div>
        <Button
          className="deck button"
          onClick={() => viewDeck(deck.deckId)}
        >
          view deck
        </Button>
      </div>
    </div>
  );

  return (
    <div className='library container'>
      <h3 className='library title'>
        Deck Library
      </h3>
      <hr width = "1530"/> 
      <div className='library buttons-container'>
        <Button
          className= "library to-dashboard"
          onClick={() => toDashboard()}
        >
          back to dashboard
        </Button>
        <Button
          className= "library to-public"
          onClick={() => toPublic()}
        >
          go to public decks
        </Button>
        <Button
          className= "library new-deck"
          onClick={() => createNewDeck()}
        >
          create new decks
        </Button>
      </div>
      <ul className="library deck-list">
          {decks.map(deck => (
            <DeckBlock deck={deck} key={deck.id}/>
          ))}
      </ul>
    </div>
  );
}

export default DeckLibrary;
