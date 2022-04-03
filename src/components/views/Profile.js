import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import {useParams} from 'react-router-dom'
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Profile.scss";

const Item = ({item, name}) => (
    <div className="item container">
        <div className="item name">{name}</div>
        <div className="item value">{item}</div>
    </div>
);

Item.propTypes = {
    user: PropTypes.object
};

// effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
async function fetchUser(userId, setUserFunc) {
    try {
        const response = await api.get(`/users/${userId}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // spinner delay
        setUserFunc(response.data);

        // This is just some data for you to see what is available.
        console.log('request to:', response.request.responseURL);
        console.log('status code:', response.status);
        console.log('status text:', response.statusText);
        console.log('requested data:', response.data);
        console.log(response);
    } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
    }
}

const Profile = () => {
    //history for navigation, params for ID in URL
    const history = useHistory();
    const {pathID} = useParams();

    const [user, setUser] = useState(null);

    const returnToGame = () => {
        history.push('/game');
    }

    useEffect(() => {
        fetchUser(pathID, setUser);
    }, []); //[dependencies]); to have it updated when any of the dependencies change

    let content = <Spinner/>;

    if (user) {
        content = (
            <div className="profile">
                <ul className="profile profile-list">
                    {[
                        <Item name={"Username"} item={user.username}/>,
                        <Item name={"Online status"} item={user.status}/>,
                    ]}
                </ul>
                <Button
                    width="50%"
                    onClick={() => returnToGame()}
                >
                    Return
                </Button>
                <Button
                    width="50%"
                    disabled={localStorage.getItem("UserID")!=pathID}
                    onClick={() => history.push(`/game/profile/${pathID}/edit`)}
                >
                    Edit
                </Button>
            </div>
        );
    }

    return (
        <BaseContainer className="profile container">
            <h2>Profile for User {pathID}</h2>
            <p className="profile paragraph">
                Get all data from the users profile:
            </p>
            {content}
        </BaseContainer>
    );
}

export {fetchUser};
export default Profile;
