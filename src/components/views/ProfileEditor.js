import {useEffect, useState} from 'react';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import {useParams} from 'react-router-dom'
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Profile.scss";
import FormField from "components/ui/FormField";
import {fetchUser} from "./Profile";
import {getDomain} from 'helpers/getDomain';

const ProfileEditor = () => {
    const history = useHistory();
    // use react-router-dom's hook to access the history
    const {pathID} = useParams();

    const [user, setUser] = useState(null);

    const changeUn = (un) => {
        const newUser = {...user};
        newUser.username = un;
        setUser(newUser);
    }

    const changeBd = (bd) => {
        const newUser = {...user};
        newUser.birthDate = bd;
        setUser(newUser);
    }

    const returnToGame = () => {
        history.push(`/game/profile/${pathID}`);
    }

    const saveUserChange = async () => {
        const requestBody = JSON.stringify(user);
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authentication': localStorage.getItem('Authentication')},
            body: requestBody
        };
        await fetch(`${getDomain()}/users/${pathID}`, requestOptions);
        //const response = await fetch(`${getDomain()}/users/${pathid}`, requestOptions);
        //const data = await response.json();
        history.push(`/game/profile/${pathID}`);
    }

    useEffect(() => {
        fetchUser(pathID, setUser);
    }, []); //[dependencies]); to have it updated when any of the dependencies change

    let content = <Spinner/>;

    if (user) {
        content = (
            <BaseContainer>
                <div className="login container">
                    <div className="login form">
                        <FormField
                            label="Username"
                            value={user.username}
                            onChange={un => changeUn(un)}
                        />
                        <div className="login button-container">
                            <Button
                                width="50%"
                                onClick={() => saveUserChange()}
                            >
                                Save
                            </Button>
                            <Button
                                width="50%"
                                onClick={() => returnToGame()}
                            >
                                Return
                            </Button>
                        </div>
                    </div>
                </div>
            </BaseContainer>
        );
    }

    return (
        <BaseContainer className="profile container">
            <h2>Edit Profile for User {pathID}</h2>
            <p className="profile paragraph">
                Enter username and birth date:
            </p>
            {content}
        </BaseContainer>
    );
}

export default ProfileEditor;
