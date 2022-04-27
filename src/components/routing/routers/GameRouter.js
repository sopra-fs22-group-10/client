import {Route} from "react-router-dom";
import Dashboard from "components/views/Dashboard";
import DeckLibrary from "components/views/DeckLibrary";
import DeckOverview from "components/views/DeckOverview";
import Profile from "components/views/Profile";
import PropTypes from 'prop-types';
import {GameGuard} from "../routeProtectors/GameGuard";

const GameRouter = props => {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
        <Route exact path={`${props.base}`}>
            <GameGuard>
                <Game/>
            </GameGuard>
        </Route>
    );
};

/*
* Don't forget to export your component!
 */

GameRouter.propTypes = {
    base: PropTypes.string
}

export default GameRouter;
