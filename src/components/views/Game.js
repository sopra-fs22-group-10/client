import {useState} from 'react';
import {useHistory} from 'react-router-dom';
import "styles/views/Game.scss";
import CloseX from "../../styles/graphics/CloseX.svg";
import {HandVis} from "../../helpers/HandVis";
import {getHandTrans} from "../../helpers/HandPositioning";
import {testSession} from "../../models/TestEntities"; //TODO: remove

const Game = () => {

    // use react-router-dom's hook to access the history
    const history = useHistory();
    const quit = () => {
        history.push('/menu/');
    }

    const [session, setSession] = useState(testSession); //TODO: use GET

    //Generate code for Hand visualisation
    let handVis = [];
    const handTransformations = getHandTrans(session.playerList);
    for (let i=0; i<session.playerList.length; i++) {
        handVis.push(
            <HandVis
                key={i}
                player={session.playerList[i]}
                transform={handTransformations[i]}
            />
        );
    }

    return (
        <body className="game body">
        <div className="game close-container">
            <img className="game close-container" src={CloseX} alt="" onClick={() => quit()}></img>
        </div>
        {handVis}
        </body>
    );
}

export default Game;
