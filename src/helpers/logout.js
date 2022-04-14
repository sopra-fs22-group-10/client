import {getDomain} from "./getDomain";
import {handleError} from 'helpers/api';

export const logout = async (history) => {
  try {
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
  } catch (error) {
    alert(`Something went wrong during the logout: \n${handleError(error)}`);
  }
}

