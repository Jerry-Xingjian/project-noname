const express = require('express');
const cors = require('cors');
const console = require('console');
const path = require('path');
const http = require('http');
require('dotenv').config();

const webapp = express();
const { connect } = require('./dbConnection');

// enable Cross-Origin Resource Sharing
webapp.use(cors());
const port = 8080;

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

// create http server for deployment
const server = http.createServer(webapp);

// connect to server
server.listen(process.env.PORT || 8080, async () => {
  await connect();
  console.log(`Server running on port: ${port}`);
});

module.exports = server;
// initialize web server
require('./wsserver');
