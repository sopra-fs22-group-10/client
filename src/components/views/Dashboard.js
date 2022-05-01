import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import {getDomain} from 'helpers/getDomain';
import HalfScreenContainer from "components/ui/HalfScreenContainer";
import PropTypes from "prop-types";
import "styles/views/Dashboard.scss";
import Triangle from "../../styles/graphics/Triangle.svg";
import Cards from "../../styles/graphics/Cards.svg";
import {logout} from "../../helpers/logout";

const FormField = props => {
    return (
        <div className="join field">
            <input
                type="text"
                className="join input"
                placeholder="enter game code..."
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

const Dashboard = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();
    const [decks, setDecks] = useState(null);
    const [joinId, setJoinId] = useState(null);

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

    useEffect(() => {
        async function fetchData() {
            //get featured public decks and add them to const decks
        }

        fetchData();
    }, []);

    let content;
    content = (
        <div className="dashboard">
            <ul className="dashboard deck-list">
            </ul>
        </div>
    );

    return (
    <div className="dashboard layout">
      <HalfScreenContainer className="dashboard container">
        <h2>Public Decks</h2>
        <hr className="dashboard hr rounded"></hr>
        {content}
        <div className="dashboard button-container">
          <Button onClick={() => publicLibrary()}>
            show more
          </Button>
        </div>
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
