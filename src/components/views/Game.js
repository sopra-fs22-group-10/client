import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";
import {logout} from "../../helpers/logout";

const Player = ({user, hist}) => (
    <div className="player container"
        onClick={() => hist.push(`game/profile/${user.id}`)}
    >
        <div className="player username">{user.username}</div>
        <div className="player name">{user.name}</div>
        <div className="player id">id: {user.id}</div>
    </div>
);

Player.propTypes = {
    user: PropTypes.object
};

const Game = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();
    const [users, setUsers] = useState(null);

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get('/users');
                await new Promise(resolve => setTimeout(resolve, 1000)); // spinner delay
                setUsers(response.data);

            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, []);

    let content = <Spinner/>;

    if (users) {
        content = (
            <div className="game">
                <ul className="game user-list">
                    {users.map(user => (
                        <Player user={user} key={user.id} hist={history}/>
                    ))}
                </ul>
                <Button
                    width="100%"
                    onClick={() => logout(history)}
                >
                    Logout
                </Button>
            </div>
        );
    }

    return (
        <BaseContainer className="game container">
            <h2>Users Overview</h2>
            <p className="game paragraph">
                Get all users from secure endpoint:
            </p>
            {content}
        </BaseContainer>
    );
}

export default Game;
