const console = require('console');
const request = require('supertest');
const express = require('express');
require('dotenv').config();
const { closeMongoDBConnection, connect } = require('../dbConnection');

const router = require('../routes/usersRoute');

const webapp = express();
webapp.use(express.urlencoded({ extended: true }));
webapp.use(express.json());
webapp.use('/', router);

// connect to the DB
let mongo;

// get all users
describe('GET /users endpoint tests,', () => {
  let response; // the response frome our express server

  beforeAll(async () => {
    mongo = await connect();
    response = await request(webapp).get('/users');
  });

  afterAll(async () => {
    try {
      await mongo.close(); // close the test file connection
      await closeMongoDBConnection(); // close the express connection
    } catch (err) {
      throw new Error(err);
    }
  });

  test('the status code is 200', () => {
    expect(response.status).toBe(200); // status code
    expect(response.type).toBe('application/json');
  });

  test('the status code is 404', async () => {
    const res = await request(webapp).get('/user');
    expect(res.status).toEqual(404);
  });
});

// get a user by id
describe('GET /users/id endpoint tests,', () => {
  let response; // the response from our express server
  let testId; // the userId for test

  beforeAll(async () => {
    mongo = await connect();
    testId = '638806cbfb91ca4b2f60289a';
    response = await request(webapp).get(`/users/${testId}`);
  });

  afterAll(async () => {
    try {
      await mongo.close(); // close the test file connection
      await closeMongoDBConnection(); // close the express connection
    } catch (err) {
      throw new Error(err);
    }
  });

  test('the status code is 200', () => {
    expect(response.status).toBe(200); // status code
    expect(response.type).toBe('application/json');
  });

  test('the status code is 404', async () => {
    const testWrongId = '638806cbfb91ca4b2f60289';
    const res = await request(webapp).get(`/users/${testWrongId}`);
    expect(res.status).toEqual(404);
  });
});

// Get a user's followers
describe('GET /users/:id/followers endpoint tests,', () => {
  let response; // the response from our express server
  let testId; // the userId for test

  beforeAll(async () => {
    mongo = await connect();
    testId = '638806cbfb91ca4b2f60289a';
    response = await request(webapp).get(`/users/${testId}/followers`);
  });

  afterAll(async () => {
    try {
      await mongo.close(); // close the test file connection
      await closeMongoDBConnection(); // close the express connection
    } catch (err) {
      throw new Error(err);
    }
  });

  test('the status code is 200', () => {
    expect(response.status).toBe(200); // status code
    expect(response.type).toBe('application/json');
  });

  test('the status code is 404', async () => {
    const testWrongId = '638806cbfb91ca4b2f60289';
    const res = await request(webapp).get(`/users/${testWrongId}/followers`);
    expect(res.status).toEqual(404);
  });
});

// Get a user's recommendations
describe('GET /rcmd/:userId endpoint tests,', () => {
  let response; // the response from our express server
  let testId; // the userId for test

  beforeAll(async () => {
    mongo = await connect();
    testId = '638806cbfb91ca4b2f60289a';
    response = await request(webapp).get(`/rcmd/${testId}`);
  });

  afterAll(async () => {
    try {
      await mongo.close(); // close the test file connection
      await closeMongoDBConnection(); // close the express connection
    } catch (err) {
      throw new Error(err);
    }
  });

  test('the status code is 200', () => {
    expect(response.status).toBe(200); // status code
    expect(response.type).toBe('application/json');
  });

  test('the status code is 404', async () => {
    const testWrongId = '638806cbfb91ca4b2f60289';
    const res = await request(webapp).get(`/rcmd/${testWrongId}`);
    expect(res.status).toEqual(404);
  });
});

// Register a new User
describe('POST /users/register endpoint tests', () => {
  let db; // the db
  let response; // the response frome our express server

  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    db = mongo.db();
    // send the request to the API and collect the response
    const requestBody = {
      email: 'xwang777@gmail.com',
      password: '09123',
    };
    response = await request(webapp).post('/users/register').send(requestBody);
  });

  const clearDatabase = async () => {
    try {
      const result = await db.collection('User').deleteOne({ email: 'xwang777@gmail.com' });
      console.log('result: ', result);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };
  afterAll(async () => {
    try {
      await clearDatabase();
      await mongo.close(); // close the test file connection
      await closeMongoDBConnection(); // close the express connection
    } catch (err) {
      throw new Error(err);
    }
  });
  test('the status code is 201', () => {
    expect(response.status).toBe(201); // status code
    expect(response.type).toBe('application/json');
  });

  test('The new user is in the database', async () => {
    const insertedUser = await db.collection('User').findOne({ email: 'xwang777@gmail.com' });
    expect(insertedUser.email).toEqual('xwang777@gmail.com');
  });

  test('missing a field (email) 404', async () => {
    const res = await request(webapp).post('/users/register')
      .send('password=123456');
    expect(res.status).toEqual(404);
  });
});

// Login a user
describe('POST /users/login endpoint tests', () => {
  let db; // the db
  let response; // the response frome our express server

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    // send the request to the API and collect the response
    const requestBody = {
      email: 'xwang777@gmail.com',
      password: '123456',
    };
    // before login, we need to register a user
    response = await request(webapp).post('/users/register').send(requestBody);
    // then we login the user
    response = await request(webapp).post('/users/login').send(requestBody);
  });

  const clearDatabase = async () => {
    try {
      const result = await db.collection('User').deleteOne({ email: 'xwang777@gmail.com' });
      console.log('result: ', result);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };
  afterAll(async () => {
    try {
      await clearDatabase();
      await mongo.close(); // close the test file connection
      await closeMongoDBConnection(); // close the express connection
    } catch (err) {
      throw new Error(err);
    }
  });
  test('the status code is 201', () => {
    expect(response.status).toBe(201); // status code
    expect(response.type).toBe('application/json');
  });

  test('The new user is in the database', async () => {
    const insertedUser = await db.collection('User').findOne({ email: 'xwang777@gmail.com' });
    expect(insertedUser.email).toEqual('xwang777@gmail.com');
  });

  test('missing a field (email) 404', async () => {
    const res = await request(webapp).post('/users/register')
      .send('password=123456');
    expect(res.status).toEqual(404);
  });
});

// search users
describe('GET /search/users endpoint tests,', () => {
  let response; // the response from our express server
  let username;

  beforeAll(async () => {
    mongo = await connect();
    username = 'xwang7';
    response = await request(webapp).get(`/search/users?username=${username}`);
  });

  afterAll(async () => {
    try {
      await mongo.close(); // close the test file connection
      await closeMongoDBConnection(); // close the express connection
    } catch (err) {
      throw new Error(err);
    }
  });

  test('the status code is 200', () => {
    expect(response.status).toBe(200); // status code
    expect(response.type).toBe('application/json');
  });
});
