const express = require('express');
const cors = require('cors');
const console = require('console');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
// const WebSocket = require('ws');
// // security feature. JSON web token - https://jwt.io
// const jwt = require('jsonwebtoken');
// require('./wsserver');
require('dotenv').config();

const webapp = express();
// const http = require('http');
const { connect } = require('./dbConnection');
// Find the JWT_SECRET inthe document
// const { JWT_SECRET } = process.env;

// enable Cross-Origin Resource Sharing
webapp.use(cors());
const port = 8080;

// // JSON web token creation
// const serverToken = jwt.sign({
//   name: 'webserver',
// }, JWT_SECRET, { expiresIn: '1h' });

// // websocket server url
// const url = 'ws://localhost:8085/';

// // websocket connection with jwt
// const connection = new WebSocket(url, {
//   headers: { token: serverToken },
// });

// connection.onopen = () => {
//   connection.send('["webserver init"]');
// };

// connection.onerror = (error) => {
//   console.log(error);
//   console.log(`WebSocket error: ${error}`);
// };

// connection.onmessage = (e) => {
//   console.log(e.data);
// };

// import routers
const usersRouter = require('./routes/usersRoute');
const postsRouter = require('./routes/postsRoute');
const profilesRouter = require('./routes/profilesRoute');

webapp.use(express.static(path.join(__dirname, '../noname/build')));
webapp.use(express.urlencoded({ extended: true }));
webapp.use(express.json());
webapp.use('/', usersRouter);
webapp.use('/', postsRouter);
webapp.use('/', profilesRouter);

// Root endpoint
webapp.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../noname/build/index.html'));
});
// connect to server
const server = http.createServer(webapp);
server.listen(process.env.PORT || 8080, async () => {
  await connect();
  console.log(`Server running on port: ${port}`);
});

// module.exports = webapp;
// require('./wsserver');
// const serverNum = webapp;

// const url = 'wss://noname-test-version-1.herokuapp.com';
// const wss = new WebSocket.Server({ noServer: true });
const wss = new WebSocket.Server({ server });

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
