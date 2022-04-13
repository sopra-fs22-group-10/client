import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import PropTypes from "prop-types";
import "styles/views/DeckOverview.scss";
import Select from 'react-select'
import {cardsList,deck} from'models/TestEntities';

const DeckOverview = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  const [deckName, setDeckName] = useState(undefined);
  const [visability, setVisability] = useState(undefined);
  const [fairness, setFairness] = useState(undefined);
  const [cards, setCards] = useState(cardsList);

  const visability_options = [
    { value: 'Private', label: 'Private' },
    { value: 'Public', label: 'Public' }
  ]

  const fairness_options = [
    { value: 'on', label: 'on' },
    { value: 'off', label: 'off' }
  ]

  const confirm = () => {
  }

  const editPicture = () => {
  }

  const editTemplate = () => {
    history.push('/game/deckOverview/editTemplate');
  }

  const editCard = () => {
    history.push('/game/deckOverview/editCard');
  }

  const deleteCard = () => {
  }

  const backToLibrary = async () => {
    history.push('/game/deckLibrary');
  }

  function getDefaultVisability(deck){
    if(deck.visability == "Private"){
      return(visability_options[0]);
    }else{
      return(visability_options[1]);
    }
  }

  function getDefaultFairness(deck){
    if(deck.fairness == "on"){
      return(fairness_options[0]);
    }else{
      return(fairness_options[1]);
    }
  }

  function cardBlock(card){
    return(
      <div className="card container">
        <div className="card image-container">
        </div>
        <h3 className="card text">{card.cardname}</h3>
        <div className="card button-container">
          <Button
            className="card edit-button"
            width="100%"
            onClick={() => editCard()}
          >
            edit
          </Button>
          <Button
            className="card delete-button"
            width="100%"
            onClick={() => deleteCard()}
          >
            delete
          </Button>
        </div>
      </div>
    );
  }

  let overview = null;

  let deckView = (
    <div className="overview deck-container">
      <div className = 'overview deck-view'>
        <div>
          <div className="template container">
            <h3 className="template title">Card Template</h3>
            <p className="template text">Theme:</p>
            <div className="template theme"></div>
            <p className="template text">Number of stats:</p>
            <p className="template text">{deck.statsNum}</p>
            <Button
              className="template edit-button"
              onClick={() => editTemplate()}
            >
              edit
            </Button>
          </div>
          <Button
            className="template button"
            width="100%"
            onClick={() => editTemplate()}
          >
            add new card
          </Button>
          <Button
            className="template button"
            width="100%"
            onClick={() => backToLibrary()}
          >
            back to library
          </Button>
        </div>
        <ul className="overview card-list">
            {cards.map(card => cardBlock(card))}
        </ul>
      </div>
    </div>
  );

  let editDeckView = (
    <div className="overview edit-container">
      <div className="overview edit-picture-container"
        onClick={() => editPicture()}>
      </div>
        <p className="overview edit-text">deck name</p>
        <input
          className="overview edit-input"
          label="Name"
          placeholder={deck.deckname}
          value={deckName}
          onChange={dn => setDeckName(dn.target.value)}
        />
        <p className="overview edit-text">Visability</p>
        <Select 
          defaultValue={getDefaultVisability(deck)}
          className="overview edit-select"
          options={visability_options} 
          onChange= {setVisability}
        />
        <p className="overview edit-text">Fairness</p>
        <Select 
          defaultValue={getDefaultFairness(deck)}
          className="overview edit-select"
          options={fairness_options} 
          onChange={setFairness}
        />
        <Button
          className="overview edit-button"
          width="100%"
          onClick={() => confirm()}
        >
          confirm
        </Button>
    </div>
  );

  if (cards) {
    overview = (
      <div className="overview container">
        {deckView}
        {editDeckView}
      </div>
    );
  }

  return (
    <div>{overview}</div>
  );
}

export default DeckOverview;
