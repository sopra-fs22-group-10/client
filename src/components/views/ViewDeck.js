import {useEffect, useState} from 'react';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import {api, handleError} from 'helpers/api';
import "styles/views/ViewDeck.scss";
import * as React from 'react';

const ViewDeck = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  const [template, setTemplate] = useState({});
  const [deckName, setDeckName] = useState(undefined);
  const [cardList, setCardList] = useState([]);

  const url = window.location.href;
  const deckId = url.substring(url.lastIndexOf('/')+1,url.length);

  const backToDashboard = async () => {
    localStorage.removeItem("deckId");
    history.push('/menu');
  }

  const viewCard = (cardId) => {
    history.push(`/menu/viewCard/${deckId}/${cardId}`);
  }

  const addDeck = async() => {
    var userId = localStorage.getItem("UserID");
    const requestBody = JSON.stringify({deckId});
    const response = await api.put(`/decks/users/${userId}`, requestBody,{
      headers:{
        'Authentication':localStorage.getItem("Authentication")
      }
    });
    alert("The deck is successfully added to your library :)")
    history.push('/menu/deckLibrary');
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
        setTemplate(response.data.template);
        setCardList(response.data.cardList);
        setDeckName(response.data.deckname);

        // See here to get more data.

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
        className="view-card image"
        src={card.image}
        ></img>
      );
    }else{
      image = (
        <div className="view-card image"></div>
      );
    }
    return(
      <div className="view-card container">
        {image}
        <h3 className="view-card text">{card.cardname}</h3>
        <Button
            className="view-card edit-button"
            width="100%"
            onClick={() => viewCard(card.cardId)}
        >
            view
        </Button>
      </div>
    );
  }

  function statBlock(stat){
    return(
      <div className="view-template stat">
        {stat.statname}
      </div>
    );
  }

  let templateBlock = null;
  if(template != undefined & JSON.stringify(template) != "{}"){
    templateBlock = (
      <div className="view-template container">
        <h3 className="view-template title">Card Template</h3>
        <ul className="view-template stat-list">
          {template.templatestats.map(stat => statBlock(stat))}
        </ul>
      </div>
    );
  }

  return (
    <div className="viewDeck deck-container">
      <div className = 'viewDeck deck-view'>
        <div className = 'viewDeck template'>
          <h3 className="viewDeck title">{deckName}</h3>
          {templateBlock}
          <Button
            className="view-template button"
            onClick={() => addDeck()}
          >
            add to my library
          </Button>
          <Button
            className="view-template button"
            onClick={() => backToDashboard()}
          >
            back to dashboard
          </Button>
        </div>
        <ul className="viewDeck card-list">
            {cardList.map(card => cardBlock(card))}
        </ul>
      </div>
    </div>
  );
}

export default ViewDeck;
