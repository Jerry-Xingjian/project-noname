const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// web socket
const wss = new WebSocket.Server({ port: process.env.PORT || 8085});
// const url = process.env.NODE_ENV === 'production'
//     ? 'https://noname-test-version-1.herokuapp.com'
//     : 'ws://localhost:8085/';
// const wss = new WebSocket('ws://localhost:8085/');

// Map of connected clients (user - client id) pairs
const connectedUsers = new Map();

// connection event
wss.on('connection', (ws, req) => {
  let client = '';
  let token;
  // client authentication get the JWT (token)
  // the webserver
  if (req.headers.token !== '') {
    token = req.headers.token;
  }

  if (ws.protocol !== '') { // the user's token
    token = ws.protocol;
    console.log('protocol', ws.protocol);
  }

  // Find the JWT_SECRET inthe document
  const { JWT_SECRET } = process.env;

  // verify the user - retrieve the username from the token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(`Error: ${err}`);
      return;
    }
    client = decoded.id;
    console.log(`New connection from user ${client}`);
    if (client !== 'webserver') {
      // add client to map of clients
      // key is the user name, value is the ws address
      connectedUsers.set(String(client), ws);
    }
  });

  // message event: sent by the webserver
  ws.on('message', (message) => {
    console.log(`Received message from user ${client}`);
    const msg = JSON.parse(message);
    console.log('msg', msg);
    if (msg.type === 'new post') { // a new user joined the chat
      // iterate over the map to notify all the connected users
      const newPost = { type: 'new post', post: msg.data };
      connectedUsers.forEach((v) => { v.send(JSON.stringify(newPost)); });
    }
  });

  // welcome message to connected clients
  const greet = { type: 'welcome' };
  ws.send(JSON.stringify(greet));
});
