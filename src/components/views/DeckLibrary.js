import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import "styles/views/DeckLibrary.scss";
import {deckList} from'models/TestEntities';


const DeckLibrary = () => {
  const history = useHistory();

  // objects for test
  const [deck, setDeck] = useState(deckList);

  const toDeckOverview = () => {
    history.push('/game/deckOverview');
  }
  const toDashboard = () => {
    history.push('/game');
  }
  const toPublic = () => {
    history.push('/game');
  }
  const createNewDeck = () => {
    history.push('/game');
  }

  const DeckBlock = ({deck}) => (
    <div className="deck container"
      onClick={() => toDeckOverview()}
    >
      <div className="deck image-container">
      </div>
      <div className="deck content-container">
        <div className="deck text-container">
          <h3 className="deck title">{deck.deckname}</h3>
          <h5 className="deck creator">by: {deck.creator}</h5>
        </div>
        <Button
          className="deck button"
          onClick={() => createNewDeck()}
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
          {deck.map(deck => (
            <DeckBlock deck={deck} key={deck.id}/>
          ))}
      </ul>
    </div>
  );
}

export default DeckLibrary;
