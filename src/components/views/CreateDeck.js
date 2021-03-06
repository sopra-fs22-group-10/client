import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import "styles/views/CreateDeck.scss";
import Select from 'react-select'
import Card from 'models/Card';
import Deck from 'models/Deck';

const CreateDeck = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  const [deck, setDeck] = useState({});
  const [pic, setPic] = useState('sth');
  const [template, setTemplate] = useState(undefined);
  const [deckName, setDeckName] = useState("");
  const [visability, setVisability] = useState(undefined);
  const [cardList, setCardList] = useState([]);

  const visability_options = [
    { value: 'PRIVATE', label: 'Private' },
    { value: 'PUBLIC', label: 'Public' }
  ]

  const defaultVisability = () => {
    if(!visability){
      return null;
    }else if(visability.value == "PRIVATE"){
      return(visability_options[0]);
    }else{
      return(visability_options[1]);
    }
  }

  const confirm = async() => {
    var templatestats = template;

    var newDeck = new Deck();
    newDeck.setDeckname(deckName);
    newDeck.setDeckImage(pic);
    newDeck.setStatus(visability.value);

    const userId = localStorage.getItem('UserID');

    const requestBody_createDeck = JSON.stringify(newDeck);
    const response_createDeck = await api.post(`/decks/users/${userId}`, requestBody_createDeck,{
      headers:{
        'Authentication':localStorage.getItem("Authentication")
      }
    });

    const requestBody_createTemplate = JSON.stringify({templatestats});
    var deckId = response_createDeck.data.deckId;
    const response_createTemplate = await api.post(`/decks/${deckId}/templates`, requestBody_createTemplate,{
      headers:{
        'Authentication':localStorage.getItem("Authentication")
      }
    });

    for(var i=0;i<cardList.length;i++){
      var card = new Card(cardList[i]);
      card.setCardId(null);
      console.log(card);
      const requestBody_createCard = JSON.stringify(card);
      console.log(requestBody_createCard);
      const response_createCard = await api.post(`/decks/${deckId}/cards`, requestBody_createCard,{
        headers:{
          'Authentication':localStorage.getItem("Authentication")
        }
      });
    }
    clearDeck();
    history.push('/menu/deckLibrary');

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

  function saveDeck(){
    localStorage.setItem("deckname",deckName);
    if(visability){
      localStorage.setItem("visability",visability.value);
    }
  }

  function clearDeck(){
    localStorage.removeItem("deckname");
    localStorage.removeItem("visability");
    localStorage.removeItem("fairness");
    localStorage.removeItem("newCards");
    localStorage.removeItem("newStats");
    localStorage.removeItem("selected pic");
  }

  const createCard = () => {
    saveDeck();
    history.push(`/menu/createCard`);
  }

  const createTemplate = () => {
    saveDeck();
    history.push(`/menu/createTemplate`);
  }

  const backToLibrary = () => {
    clearDeck();
    history.push('/menu/deckLibrary');
  }

  function editTemplate(){
    saveDeck();
    history.push(`/menu/createTemplate`);
  }

  function editCard(card){
    saveDeck();
    localStorage.setItem('editCard',JSON.stringify(card));
    history.push(`/menu/createCard`);
  }

  const searchImage = () => {
    localStorage.setItem("isCreateDeck",true);
    history.push(`/menu/searchImage`);
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

        var deckname = localStorage.getItem('deckname');
        if(deckname){
          setDeckName(deckname);
        }
        var deckVisability = localStorage.getItem('visability');
        if(deckVisability){
          if(deckVisability == "PUBLIC"){
            setVisability(visability_options[1]); 
          }else{
            setVisability(visability_options[0]);
          }
          console.log(visability);
        }

        var picture = localStorage.getItem("selected pic");
        localStorage.removeItem("isCreateDeck");
        if(picture){
            setPic(picture);
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
    let image = null;
    if(card.image.includes('http')){
      image = (
        <img 
        className="card image"
        src={card.image}
        ></img>
      );
    }else{
      image = (
        <div className="card image"></div>
      );
    }
    return(
      <div className="create-card container">
        {image}
        <h3 className="create-card text">{card.cardname}</h3>
        <div className="create-card button-container">
          <Button
            className="create-card edit-button"
            width="100%"
            onClick={() => editCard(card)}
          >
            edit
          </Button>
          <Button
            className="create-card delete-button"
            width="100%"
            onClick={() => deleteCard(card)}
          >
            delete
          </Button>
        </div>
      </div>
    );
  }

  function statBlock(stat){
    return(
      <div className="template stat">
        {stat.statname}
      </div>
    );
  }

  let templateBlock = null;
  if(template){
    templateBlock = (
      <div>
        <div className="create-template container">
            <h3 className="template title">Card Template</h3>
            <ul className="template stat-list">
              {template.map(stat => statBlock(stat))}
            </ul>
            <Button
            className="create-template edit-button"
            onClick={() => editTemplate()}
            >
            edit
            </Button>
        </div>
        <Button
            className="create-template button"
            width="100%"
            onClick={() => createCard()}
          >
            add new card
          </Button>
          <Button
            className="create-template button"
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
            className="create-template create-new"
            onClick={() => createTemplate()}
        >
            Create Template
        </Button>
        <Button
            width="100%"
            className="create-template button"
            onClick={() => backToLibrary()}
        >
            back to library
        </Button>
      </div>
    );
  }

  let overview = null;

  let deckView = (
    <div className="create-overview deck-container">
      <div className = 'create-overview deck-view'>
        {templateBlock}
        <ul className="create-overview card-list">
            {cardList.map(card => cardBlock(card))}
        </ul>
      </div>
    </div>
  );

  function imageBlock(){
    if(pic){
        if(pic.includes('http')){
            return(
                <img className= "overview image"
                    src={pic}
                    onClick = {() => searchImage()}
                ></img>
            );
        }else{
            return(
                <Button 
                    className="overview search-image-button"
                    onClick={() => searchImage()}
                >
                    <h2 className="editCard search-image-text">
                        + Add Image
                    </h2>
                </Button> 
            );
        }
    }
  }

  let editDeckView = (
    <div className="create-overview edit-container">
      {imageBlock()}
        <p className="create-overview edit-text">deck name</p>
        <input
          className="create-overview edit-input"
          label="Name"
          placeholder={deck.deckname}
          value={deckName}
          onChange={dn => setDeckName(dn.target.value)}
        />
        <p className="create-overview edit-text">Visibility</p>
        <Select 
          defaultValue={defaultVisability}
          className="create-overview edit-select"
          options={visability_options} 
          onChange= {setVisability}
        />
        <Button
          disabled={!template | !visability | !deckName}
          className="create-overview edit-button"
          width="100%"
          onClick={() => confirm()}
        >
          confirm
        </Button>
    </div>
  );

  if (cardList) {
    overview = (
      <div className="create-overview container">
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
