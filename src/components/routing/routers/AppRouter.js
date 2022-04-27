import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import MenuRouter from "./MenuRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Registration from "components/views/Registration";
import Header from "../../views/Header";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to={'/login'}/>
        </Route>
        <Route exact path="/login">
          <LoginGuard>
            <div>
              <Header height="100"/>
              <Login/>
            </div>
          </LoginGuard>
        </Route>
        <Route exact path="/registration">
          <LoginGuard>
            <div>
              <Header height="100"/>
              <Registration/>
            </div>
          </LoginGuard>
        </Route>
        <Route path="/menu">
          <GameGuard>
            <div>
              <Header height="100"/>
              <MenuRouter base={"/menu"}/>
            </div>
          </GameGuard>
        </Route>
        <Route exact path="/game">
          <GameGuard>
            <GameRouter base={"/game"}/>
          </GameGuard>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;
