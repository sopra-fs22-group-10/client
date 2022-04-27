import {getDomain} from "./getDomain";

export const logout = async (history) => {
    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
            'Authentication': localStorage.getItem('Authentication')}
    };
    const response = await fetch(`${getDomain()}/users/${localStorage.getItem('UserID')}/logout`, requestOptions);
    console.log(response.status);
    localStorage.removeItem('Authentication');
    localStorage.removeItem('UserID');
    history.push('/login');
}

