import {Route} from "react-router-dom";
import Game from "components/views/Game";
import PropTypes from 'prop-types';
import {GameGuard} from "../routeProtectors/GameGuard";
import Lobby from "components/views/Lobby";
import Header from "../../views/Header";

const GameRouter = props => {
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Route exact path={`${props.base}/:pathID/play`}>
            <GameGuard>
                <Game/>
            </GameGuard>
        </Route>
        <Route exact path={`${props.base}/:pathID/lobby`}>
            <GameGuard>
                <Header height="100"/>
                <Lobby/>
            </GameGuard>
        </Route>
      </div>
    );
};

/*
* Don't forget to export your component!
 */

GameRouter.propTypes = {
    base: PropTypes.string
}

export default GameRouter;
