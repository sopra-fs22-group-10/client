import { isProduction } from 'helpers/isProduction';

/**
 * This helper function returns the current domain of the API.
 * If the environment is production, the production Heroku URL will be returned.
 * Otherwise, the link localhost:8080 will be returned (Spring server default port).
 * @returns {string}
 */
export const getDomain = () => {
  const prodUrl = 'https://sopra-fs22-group-10-client.herokuapp.com';
  const devUrl = 'http://localhost:8080';

  return isProduction() ? prodUrl : devUrl;
};
