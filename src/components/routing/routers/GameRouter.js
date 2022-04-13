import {Route} from "react-router-dom";
import Dashboard from "components/views/Dashboard";
import DeckLibrary from "components/views/DeckLibrary";
import DeckOverview from "components/views/DeckOverview";
import Profile from "components/views/Profile";
import PropTypes from 'prop-types';
import {GameGuard} from "../routeProtectors/GameGuard";
import ProfileEditor from "../../views/ProfileEditor";
import {ProfileGuard} from "../routeProtectors/ProfileGuard";
import EditTemplate from "components/views/EditTemplate";
import EditCard from "components/views/EditCard";

const GameRouter = props => {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Route exact path={`${props.base}`}>
                <GameGuard>
                    <Dashboard/>
                </GameGuard>
            </Route>
            <Route exact path={`${props.base}/profile/:pathID`}>
                <GameGuard>
                    <Profile/>
                </GameGuard>
            </Route>
            <Route exact path={`${props.base}/profile/:pathID/edit`}>
                <GameGuard>
                    <ProfileGuard>
                        <ProfileEditor/>
                    </ProfileGuard>
                </GameGuard>
            </Route>
            <Route exact path={`${props.base}/deckLibrary`}>
                <GameGuard>
                    <DeckLibrary/>
                </GameGuard>
            </Route>
            <Route exact path={`${props.base}/deckOverview`}>
                <GameGuard>
                    <DeckOverview/>
                </GameGuard>
            </Route>
            <Route exact path={`${props.base}/deckOverview/editTemplate`}>
                <GameGuard>
                    <EditTemplate/>
                </GameGuard>
            </Route>
            <Route exact path={`${props.base}/deckOverview/editCard`}>
                <GameGuard>
                    <EditCard/>
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
