import {Route} from "react-router-dom";
import Game from "components/views/Game";
import Profile from "components/views/Profile";
import PropTypes from 'prop-types';
import {GameGuard} from "../routeProtectors/GameGuard";
import ProfileEditor from "../../views/ProfileEditor";
import {ProfileGuard} from "../routeProtectors/ProfileGuard";

const GameRouter = props => {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Route exact path={`${props.base}`}>
                <GameGuard>
                    <Game/>
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
