import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import "styles/views/DeckOverview.scss";
import Select from 'react-select'
import * as React from 'react';
import Deck from 'models/Deck';

const DeckOverview = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  const [deck, setDeck] = useState({});
  const [pic, setPic] = useState('sth');
  const [template, setTemplate] = useState({});
  const [deckName, setDeckName] = useState(undefined);
  const [visability, setVisability] = useState(undefined);
  const [cardList, setCardList] = useState([]);

  const url = window.location.href;
  const deckId = url.substring(url.lastIndexOf('/')+1,url.length);
  const height = window.innerHeight;

  const visability_options = [
    { value: 'PRIVATE', label: 'Private' },
    { value: 'PUBLIC', label: 'Public' }
  ]

  const confirm = async() => {
    var newDeck = new Deck(deck);
    newDeck.setDeckname(deckName);
    newDeck.setDeckImage(pic);
    newDeck.setStatus(visability.value);
    const requestBody = JSON.stringify(newDeck);
    const response = await api.put(`/decks/${deckId}`, requestBody,{
      headers:{
        'Authentication':localStorage.getItem("Authentication")
      }
    });
    localStorage.removeItem("selected pic");
    history.push('/menu/deckLibrary');
  }

  const searchImage = () => {
    localStorage.setItem("isEditDeck",deckId);
    history.push(`/menu/searchImage`);
  }

  const deleteCard = async(cardId) => {
    let response_deleteCard = await api.delete('/decks/'+deckId+'/cards/'+cardId,{
      headers:{
        'Authentication':localStorage.getItem("Authentication")
      }
    });
    let response_getDeck = await api.get('/decks/'+deckId,{
      headers:{
        'Authentication':localStorage.getItem("Authentication")
      }
    });
    setDeck(response_getDeck.data);
    setCardList(response_getDeck.data.cardList);

    localStorage.removeItem("cardId");
  }

  const createCard = () => {
    localStorage.setItem("deckId",deckId);
    history.push(`/menu/createCard`);
  }

  const backToLibrary = async () => {
    localStorage.removeItem("deckId");
    localStorage.removeItem("selected pic");
    history.push('/menu/deckLibrary');
  }

  function defaultVisability(){
    if(visability == "PRIVATE"){
      return(visability_options[0]);
    }else{
      return(visability_options[1]);
    }
  }

  function editCard(deckId,cardId){
    history.push(`/menu/editCard/${deckId}/${cardId}`);
  }


  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        let response = await api.get('/decks/'+deckId,{
          headers:{
            'Authentication':localStorage.getItem("Authentication")
          }
        });

        // Get the returned users and update the state.
        setDeck(response.data);
        setPic(response.data.deckImage);
        setTemplate(response.data.template);
        setCardList(response.data.cardList);
        if(response.data.deckstatus == "PUBLIC"){
          setVisability(visability_options[1]);
        }else{
          setVisability(visability_options[0]);
        }
        setDeckName(response.data.deckname);

        var picture = localStorage.getItem("selected pic");
        localStorage.removeItem("isEditDeck");
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
      <div className="card container">
        {image}
        <h3 className="card text">{card.cardname}</h3>
        <div className="card button-container">
          <Button
            className="card edit-button"
            width="100%"
            onClick={() => editCard(deckId,card.cardId)}
          >
            edit
          </Button>
          <Button
            className="card delete-button"
            width="100%"
            onClick={() => deleteCard(card.cardId)}
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
  if(template != undefined & JSON.stringify(template) != "{}"){
    templateBlock = (
      <div className="template container">
        <h3 className="template title">Card Template</h3>
        <ul className="template stat-list">
          {template.templatestats.map(stat => statBlock(stat))}
        </ul>
      </div>
    );
  }

  let overview = null;

  let deckView = (
    <div maxHeight={height + "px"} className="overview deck-container">
      <div className = 'overview deck-view'>
        <div className = 'overview template'>
          {templateBlock}
          <Button
            className="template button"
            onClick={() => createCard()}
          >
            add new card
          </Button>
          <Button
            className="template button"
            onClick={() => backToLibrary()}
          >
            back to library
          </Button>
        </div>
        <ul className="overview card-list">
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

  let editDeckView = null;
  if(visability){
    editDeckView = (
      <div className="overview edit-container">
        {imageBlock()}
          <p className="overview edit-text">deck name</p>
          <input
            className="overview edit-input"
            label="Name"
            placeholder={deck.deckname}
            value={deckName}
            onChange={dn => setDeckName(dn.target.value)}
          />
          <p className="overview edit-text">Visibility</p>
          <Select 
            defaultValue={defaultVisability()}
            className="overview edit-select"
            options={visability_options} 
            onChange= {setVisability}
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
  }

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

export default DeckOverview;
