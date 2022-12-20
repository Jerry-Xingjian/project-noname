const console = require('console');
const dbLib = require('../models/usersModel');
const rcmdLib = require('../models/rcmd');

const welcome = ((req, res) => {
  res.json({ message: 'Welcome to backend' });
});

// implement the POST /users/login endpoint
const loginUser = (async (req, res) => {
  console.log('user Login');
  if (!req.body.email || !req.body.password) {
    res.status(404).json({ message: 'missing email or password' });
    return;
    // res.end();
  }
  try {
    const userInfo = {
      // username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    };
    const response = await dbLib.login(userInfo);
    res.status(201).json({ token: response });
  } catch (err) {
    const text = err.message.toString();
    if (text.includes('Password')) {
      res.status(409).send({ Error: 'password does not match!' });
    } else if (text.includes('user')) {
      res.status(410).send({ Error: 'user email does not match!' });
    }
  }
});

// implement the POST /users/register endpoint
const creatUser = (async (req, res) => {
  console.log('CREATE a user');
  const defaultAvatar = 'https://nonome-project-media.s3.amazonaws.com/default_avatar.png';
  // parse the body of the request
  // check whether the request body have email or password
  // check typeof email and password
  // check the length of password
  if (!req.body.email || !req.body.password) {
    res.status(404).json({ message: 'missing email or password' });
    return;
  }

  // Construct default username
  const defaultUsername = req.body.email.split('@')[0];
  console.log('default username', defaultUsername);

  try {
    // create the new user
    const newUser = {
      username: defaultUsername,
      email: req.body.email,
      password: req.body.password,
      profilePicture: defaultAvatar,
    };
    // encrypt the password
    // console.log(bcrypt.hash(newUser.password, 10))
    const response = await dbLib.register(newUser);
    // send the response with the appropirate status code
    // status 201 means created success
    res.status(201).json({ token: response });
  } catch (err) {
    const text = err.message.toString();
    if (text.includes('duplicate')) {
      res.status(410).send({ Error: 'Duplicate email!' });
    } else {
      res.status(409).json({ message: err });
    }
  }
});

const getUsers = (async (req, res) => {
  console.log('READ all users');
  // backend authorization, not implemented now
  /*
  if (authenticateUser(req.headers.authorization, JWT_SECRET)) {
    try {
      // console.log(JWT_SECRET);
      // get the data from the db
      const results = await dbLib.getAllUser();
      // send the response with the appropirate status code
      res.status(200).json({ response: results });
    } catch (err) {
      res.status(404).json({ message: 'there was an error' });
    }
  } else {
    res.status(401).json({ error: 'failed authentication' });
  }
  */
  try {
    // get the data from the db
    const results = await dbLib.getAllUser();
    // send the response with the appropirate status code
    res.status(200).json({ response: results });
  } catch (err) {
    res.status(404).json({ message: 'there was an error' });
  }
});

// implement the GET /users/:id endpoint
const getUsersById = (async (req, res) => {
  try {
    // todo: check whether this is a valid ID
    // get the data from the db
    const results = await dbLib.getUserByUserId(req.params.id);
    // send the response with the appropirate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was an error' });
  }
});

// implement the GET /users/:id/followers endpoint
const getFollowersByUserId = (async (req, res) => {
  console.log('READ followers');
  try {
    // todo: check whether this is a valid ID
    // get the data from the db
    const results = await dbLib.getFollowersByUserId(req.params.id);
    // send the response with the appropirate status code
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was an error' });
  }
});

// get all user's recommendation users
const getUserRcmd = async (req, res) => {
  if (!req.params.userId) {
    res.status(404).json({ message: 'missing user id' });
    res.end();
  }
  try {
    const results = await rcmdLib.getUserRcmd(req.params.userId);
    if (!results) {
      res.status(204).json({ message: 'empty recommendations result' });
    } else {
      res.status(200).json({ data: results });
    }
  } catch (err) {
    console.log('err', err);
    res.status(404).json({ message: 'there was an error' });
  }
};

const searchUser = async (req, res) => {
  if (!req.query.username) {
    res.status(404).json({ message: 'missing username' });
    res.end();
  }
  try {
    const results = await dbLib.searchUser(req.query.username);
    if (!results) {
      res.status(204).json({ message: 'empty search result' });
    } else {
      res.status(200).json({ data: results });
    }
  } catch (err) {
    res.status(404).json({ message: 'there was an error' });
  }
};

module.exports = {
  welcome,
  getUsers,
  getUsersById,
  getFollowersByUserId,
  creatUser,
  loginUser,
  getUserRcmd,
  searchUser,
};
