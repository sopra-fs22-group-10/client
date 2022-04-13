import React, {useState} from 'react';
import {handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import FormField from "components/ui/FormField";
import {getDomain} from "../../helpers/getDomain";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */

const Login = () => {
    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const doLogin = async () => {
        try {
            const requestBody = JSON.stringify({username, password});
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: requestBody
            };
            const response = await fetch(`${getDomain()}/users/login`, requestOptions);
            const userData = await response.json();

            if (response.headers.get("Authentication")==='null' || response.headers.get("Authentication")==null) {
                throw new Error(`login unsuccessful!: \n ${userData.trace}`)
            }

            console.log("Logged in as user:")
            console.log(userData)
            localStorage.setItem('Authentication', response.headers.get("Authentication")); //store authentification
            localStorage.setItem('UserID', userData.id);

            // Login successfully worked --> navigate to the route /game in the GameRouter
            history.push(`/game`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <div className="login container">
                <div className="login form">
                    <FormField
                        label="Username"
                        value={username}
                        onChange={un => setUsername(un)}
                    />
                    <FormField
                        label="Password"
                        value={password}
                        onChange={pw => setPassword(pw)}
                    />
                    <div className="login button-container">
                        <Button
                            disabled={!username || !password}
                            width="100%"
                            onClick={() => doLogin()}
                        >
                            Login
                        </Button>
                    </div>
                    <label className="login link" onClick={() => history.push('/registration')}> Don't have an account? Sign up </label>
                </div>
            </div>
        </BaseContainer>
    );
};

                        // <Button
                        //     width="100%"
                        //     onClick={() => history.push('/registration')}
                        // >
                        //     Registration
                        // </Button>

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
