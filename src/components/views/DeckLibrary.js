import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import "styles/views/DeckLibrary.scss";
import * as React from 'react';

const DeckLibrary = () => {
  const history = useHistory();

  // objects for test
  const [decks, setDecks] = useState([]);
  const [open, setOpen] = useState(false);

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

  const deleteDeck = async(deckId) => {
    let response_deleteDeck = await api.delete('/decks/'+deckId,{
      headers:{
        'Authentication':localStorage.getItem("Authentication")
      }
    });
    const userId = localStorage.getItem('UserID');
    let response_getDecks = await api.get('/users/'+userId);
    setDecks(response_getDecks.data.deckList);
    
    localStorage.removeItem("deckId");
    setOpen(false);
  }


  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const userId = localStorage.getItem('UserID');
        let response = await api.get('/users/'+userId);

        // Get the returned users and update the state.
        setDecks(response.data.deckList);

        // See here to get more data.
        } catch (error) {
        console.error(`Something went wrong: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong! See the console for details.");
      }
    }

    fetchData();
  }, []);

  function DeckBlock(deck){
    let image = null;
    if(deck.deckImage.includes('http')){
      image = (
        <img 
          className="deck image-container"
          src={deck.deckImage}
        ></img>
      );
    }else{
      image = (
        <div className="deck image-container"></div>
      );
    }
    return(
      <div className="deck container">
      {image}
      <div className="deck content-container">
        <div className="deck text-container">
          <h3 className="deck title">{deck.deckname}</h3>
          <h5 className="deck creator">Status: {deck.deckstatus}</h5>
        </div>
        <div className="deck button-container">
          <Button
            className="deck view-deck"
            onClick={() => viewDeck(deck.deckId)}
          >
            view deck
          </Button>
          <Button
            className="deck delete-deck"
            onClick={() => deleteDeck(deck.deckId)}
          >
            delete deck
          </Button>
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className='library container'>
      <h3 className='library title'>
        Deck Library
      </h3>
      <hr className='library hr rounded'/>
      <div className='library buttons-container'>
        <Button
          className= "library to-dashboard"
          onClick={() => toDashboard()}
        >
          To dashboard
        </Button>
        <Button
          className= "library to-public"
          onClick={() => toPublic()}
        >
          To public decks
        </Button>
        <Button
          className= "library new-deck"
          onClick={() => createNewDeck()}
        >
          create new decks
        </Button>
      </div>
      <ul className="library deck-list">
          {decks.map(deck => DeckBlock(deck))}
      </ul>
    </div>
  );
}

export default DeckLibrary;