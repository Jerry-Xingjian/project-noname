import axios from 'axios';
// General information / configuration for the API
const root = 'https://635be95f8aa87edd91548d12.mockapi.io/5570/Group9';
// root for part of the backen

// const rootTemp = 'http://localhost:8080';

const rootTemp = 
  process.env.NODE_ENV === "production"
  ? "https://noname-test-version-1.herokuapp.com"
  : "http://localhost:8080";

// Add the token to all HTTP request
const setHeaders = () => {
  axios.defaults.headers.common.Authorization = (sessionStorage.getItem('app-token') !== null) ? sessionStorage.getItem('app-token') : null;
};

/**
 * deletes any (expired) token and relaunch the app
 */
const reAuthenticate = (status) => {
  if (status === 401) {
    // delete the token
    sessionStorage.removeItem('app-token');
    // reload the app
    window.location.reload(true);
  }
};

export default {
  root,
  rootTemp,
  setHeaders,
  reAuthenticate,
};
