import {Route} from "react-router-dom";
import Dashboard from "components/views/Dashboard";
import Game from "components/views/Game";
import DeckLibrary from "components/views/DeckLibrary";
import DeckOverview from "components/views/DeckOverview";
import Profile from "components/views/Profile";
import PropTypes from 'prop-types';
import {GameGuard} from "../routeProtectors/GameGuard";
import ProfileEditor from "../../views/ProfileEditor";
import {ProfileGuard} from "../routeProtectors/ProfileGuard";
import EditTemplate from "components/views/EditTemplate";
import EditCard from "components/views/EditCard";
import DeckSelector from "components/views/DeckSelector"
import CreateDeck from "components/views/CreateDeck";
import CreateTemplate from "components/views/CreateTemplate";
import CreateCard from "components/views/CreateCard";
import SearchImage from "components/views/SearchImage";
import ViewDeck from "components/views/ViewDeck";
import ViewCard from "components/views/ViewCard";
import Header from "../../views/Header";

const MenuRouter = props => {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <Route exact path={`${props.base}/`}>
                <GameGuard>
                    <Header height="100"/>
                    <Dashboard/>
                </GameGuard>
            </Route>
            <Route exact path={`${props.base}/deckLibrary`}>
                <GameGuard>
                    <Header height="100"/>
                    <DeckLibrary/>
                </GameGuard>
            </Route>
            <Route exact path={`${props.base}/viewDeck/:pathID`}>
                <GameGuard>
                    <ViewDeck/>
                </GameGuard>
            </Route>
            <Route exact path={`${props.base}/viewCard/:pathID/:pathID`}>
                <GameGuard>
                    <ViewCard/>
                </GameGuard>
            </Route>
            <Route exact path={`${props.base}/deckOverview/:pathID`}>
                <GameGuard>
                    <DeckOverview/>
                </GameGuard>
            </Route>
            <Route exact path={`${props.base}/createDeck`}>
                <GameGuard>
                    <CreateDeck/>
                </GameGuard>
            </Route>
            <Route exact path={`${props.base}/editTemplate/:pathID`}>
                <GameGuard>
                    <EditTemplate/>
                </GameGuard>
            </Route>
            <Route exact path={`${props.base}/createTemplate`}>
                <GameGuard>
                    <CreateTemplate/>
                </GameGuard>
            </Route>
            <Route exact path={`${props.base}/createCard`}>
                <GameGuard>
                    <CreateCard/>
                </GameGuard>
            </Route>
            <Route exact path={`${props.base}/editCard/:pathID/:pathID`}>
                <GameGuard>
                    <EditCard/>
                </GameGuard>
            </Route>
            <Route exact path={`${props.base}/searchImage`}>
                <GameGuard>
                    <SearchImage/>
                </GameGuard>
            </Route>
            <Route exact path={`${props.base}/deckSelector`}>
                <GameGuard>
                    <Header height="100"/>
                    <DeckSelector/>
                </GameGuard>
            </Route>
        </div>
    );
};

/*
* Don't forget to export your component!
 */

MenuRouter.propTypes = {
    base: PropTypes.string
}

export default MenuRouter;
