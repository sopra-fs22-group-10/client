import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import "styles/views/CreateDeck.scss";
import Select from 'react-select'
import Template from 'models/Template';
import Deck from 'models/Deck';

const CreateDeck = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  const [deck, setDeck] = useState({});
  const [template, setTemplate] = useState({});
  const [deckName, setDeckName] = useState(undefined);
  const [visability, setVisability] = useState(undefined);
  const [fairness, setFairness] = useState(undefined);
  const [cardList, setCardList] = useState([]);

  const visability_options = [
    { value: 'Private', label: 'Private' },
    { value: 'Public', label: 'Public' }
  ]

  const fairness_options = [
    { value: 'on', label: 'on' },
    { value: 'off', label: 'off' }
  ]

  const confirm = async() => {
    var deckname = deckName;
    var deckstatus = visability.value;
    var templatestats = template;
    console.log(templatestats);
    var newDeck = new Deck({deckname, deckstatus, template, cardList});

    const userId = localStorage.getItem('UserID');

    const requestBody_createDeck = JSON.stringify({deckname});
    const response_createDeck = await api.post(`/decks/users/${userId}`, requestBody_createDeck);

    // const requestBody_createTemplate = JSON.stringify({templatestats});
    // var deckId = response_createDeck.data.deckId;
    // const response_createTemplate = await api.post(`/decks/${deckId}/templates`, templatestats);

    localStorage.removeItem("newCards");
    localStorage.removeItem("newStats");
    history.push('/menu/deckLibrary');

  }

  const editPicture = () => {
  }

  const deleteCard = (card) => {
    var newCards = JSON.parse(localStorage.getItem('newCards'));
    newCards.splice(getCardIndex(card),1);
    localStorage.setItem("newCards",JSON.stringify(newCards));
    setCardList(newCards);
  }

  function getCardIndex(card){
    var newCards = JSON.parse(localStorage.getItem('newCards'));
    for(var i=0; i<newCards.length; i++){
        if(card.cardId == newCards[i].cardId){
            return i;
        }
    }
  }

  const createCard = () => {
    history.push(`/menu/createCard`);
  }

  const createTemplate = () => {
    history.push(`/menu/createTemplate`);
  }

  const backToLibrary = () => {
    localStorage.removeItem("newCards");
    localStorage.removeItem("newStats");
    history.push('/menu/deckLibrary');
  }

  function editTemplate(){
    history.push(`/menu/createTemplate`);
  }

  function editCard(card){
    localStorage.setItem('editCard',JSON.stringify(card));
    history.push(`/menu/createCard`);
  }

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        var newStats = localStorage.getItem('newStats');
        var newCards = localStorage.getItem('newCards');
        if(newStats){
            var templatestats = JSON.parse(newStats);
            setTemplate(templatestats);
        }
        if(newCards){
            setCardList(JSON.parse(newCards));
        }

        } catch (error) {
        console.error(`Something went wrong: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong! See the console for details.");
      }
    }

    fetchData();
  }, []);

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
            onClick={() => editCard(card)}
          >
            edit
          </Button>
          <Button
            className="card delete-button"
            width="100%"
            onClick={() => deleteCard(card)}
          >
            delete
          </Button>
        </div>
      </div>
    );
  }

  let templateBlock = null;
  if(JSON.stringify(template) != "{}"){
    templateBlock = (
      <div>
        <div className="template container">
            <h3 className="template title">Card Template</h3>
            <p className="template text">Theme:</p>
            <div className="template theme"></div>
            <p className="template text">Number of stats:</p>
            <p className="template text">{template.length}</p>
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
            onClick={() => createCard()}
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
    );
  }else{
    templateBlock = (
      <div>
        <Button
            className="template create-new"
            onClick={() => createTemplate()}
        >
            Create Template
        </Button>
        <Button
            width="100%"
            className="template button"
            onClick={() => backToLibrary()}
        >
            back to library
        </Button>
      </div>
    );
  }

  let overview = null;

  let deckView = (
    <div className="overview deck-container">
      <div className = 'overview deck-view'>
        {templateBlock}
        <ul className="overview card-list">
            {cardList.map(card => cardBlock(card))}
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
          className="overview edit-select"
          options={visability_options} 
          onChange= {setVisability}
        />
        <p className="overview edit-text">Fairness</p>
        <Select 
          className="overview edit-select"
          options={fairness_options} 
          onChange={setFairness}
        />
        <Button
          disabled={!template | !visability | !deckName | !fairness}
          className="overview edit-button"
          width="100%"
          onClick={() => confirm()}
        >
          confirm
        </Button>
    </div>
  );

  if (cardList) {
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

export default CreateDeck;
