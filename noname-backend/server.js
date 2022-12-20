const express = require('express');
const cors = require('cors');
const console = require('console');
const path = require('path');
// const WebSocket = require('ws');
// // security feature. JSON web token - https://jwt.io
// const jwt = require('jsonwebtoken');
require('./wsserver');
require('dotenv').config();

const webapp = express();
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
webapp.listen(8080, async () => {
  await connect();
  console.log(`Server running on port: ${port}`);
});
