import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import HalfScreenContainer from "components/ui/HalfScreenContainer";
import PropTypes from "prop-types";
import {getDomain} from 'helpers/getDomain';
import "styles/views/Dashboard.scss";
import Triangle from "../../styles/graphics/Triangle.svg";
import Cards from "../../styles/graphics/Cards.svg";
import LookingGlass from "../../styles/graphics/looking_glass.svg";
import {logout} from "../../helpers/logout";

const FormField = props => {
    return (
        <div className="join field">
            <input
                type="text"
                className="join input"
                placeholder="enter game code..."
                value={props.value || ""}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

const Dashboard = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();
    const [decks, setDecks] = useState(null);
    const [joinId, setJoinId] = useState("");
    const [query, setQuery] = useState("");

    const host = () => {
      history.push('/menu/deckSelector');
    }

    const library = () => {
        history.push('/menu/deckLibrary');
    }
    const join = async (joinId) => {
      try {
        let userId = localStorage.getItem('UserID');
        let username = localStorage.getItem('Username'); //temporary!!!!
        const requestBody = JSON.stringify({userId, username});
        const requestOptions = {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
                        body: requestBody
        };
        const response = await fetch(`${getDomain()}/session/join/${joinId}`, requestOptions);
        history.push(`/game/${joinId}/lobby`);

      } catch (error) {
        console.error(`Something went wrong while joining the session: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while joining the session! See the console for details.");
      }
    }
    const publicLibrary = () => {
    }

    async function addDeck(deckId){
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

    function viewDeck(deckId){
      history.push(`/menu/viewDeck/${deckId}`);
    }

    const search = async() => {
      let response = await api.get('/users');
      var deckList = [];
      var users = response.data;

      for(var i=0; i<users.length;i++){
        var decks = users[i].deckList;
        for(var j=0; j<decks.length; j++){
          if(decks[j].deckstatus == "PUBLIC"){
            deckList.push(decks[j]);
          }
        }
      }
      let newDeckList = [];
      for(var i=0; i<deckList.length; i++){
        if(deckList[i].deckname.includes(query)){
          newDeckList.push(deckList[i]);
        }
      }
      setDecks(newDeckList);
    }
    
    const showAll = async() => {
      let response = await api.get('/users');
      var deckList = [];
      var users = response.data;

      for(var i=0; i<users.length;i++){
        var decks = users[i].deckList;
        for(var j=0; j<decks.length; j++){
          if(decks[j].deckstatus == "PUBLIC"){
            deckList.push(decks[j]);
          }
        }
      }
      setDecks(deckList);
    }

    useEffect(() => {
      async function fetchData() {
        //get featured public decks and add them to const decks
        showAll();
      }

      fetchData();
    }, []);

    const DeckBlock = ({deck}) => (
      <div className="deck-block container">
        <div className="deck-block image-container">
        </div>
        <div className="deck-block content-container">
          <div className="deck-block text-container">
            <h3 className="deck-block title">{deck.deckname}</h3>
            <h5 className="deck-block creator">Status: {deck.deckstatus}</h5>
          </div>
          <div className="deck-block button-container">
            <Button
              className="deck-block view-deck"
              onClick={() => viewDeck(deck.deckId)}
            >
              view
            </Button>
            <Button
              className="deck-block add-deck"
              onClick={() => addDeck(deck.deckId)}
            >
              add
            </Button>
          </div>
        </div>
      </div>
    );

    let content;
    if(decks){
      content = (
        <div className="dashboard">
            <ul className="dashboard deck-list">
              {decks.map(deck => (
                <DeckBlock deck={deck} key={deck.id}/>
              ))}
            </ul>
        </div>
      );
    }

    return (
    <div className="dashboard layout">
      <HalfScreenContainer className="dashboard container">
        <h2>Public Decks</h2>
        <hr className="dashboard hr rounded"></hr>
        <div className="search search-field-container">
            <img className="search image" src={LookingGlass} alt=""></img>
            <input
                className="search input"
                placeholder="Input keyword..."
                value= {query}
                onChange={e => setQuery(e.target.value)}
            />
            <Button
                className="search search-button"
                disabled = {!query}
                onClick={() => search()}
            >
                search
            </Button>
            <Button
                className="search cancel-button"
                onClick={() => showAll()}
            >
                show all
            </Button>
        </div>
        {content}
      </HalfScreenContainer>
      <div className="dashboard right">
        <div className="dashboard top">
          <div className="join container">
            <FormField className="join field"
              onChange={i => setJoinId(i)}
            >
            </FormField>
            <Button onClick={() => join(joinId)}>
              JOIN
            </Button>
          </div>
          <div className="dashboard logout">
            <Button onClick={() => logout(history)}>
            Logout
            </Button>
          </div>
        </div>
        <div className="dashboard buttons">
          <div className="large-button container" onClick={() => host()}>
            <img className="large-button image" src={Triangle} alt=""></img>
            <hr className="large-button hr rounded"></hr>
            <h2 className="large-button title">
              Host Game
            </h2>
          </div>
          <div className="large-button container" onClick={() => library()}>
            <img className="large-button image" src={Cards} alt=""></img>
            <hr className="large-button hr rounded"></hr>
            <h2 className="large-button title">
              Deck Library
            </h2>
          </div>
        </div>
      </div>
    </div>
    );
}

export default Dashboard;
