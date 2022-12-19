const console = require('console');
const request = require('supertest');
const express = require('express');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('../dbConnection');

const profileRouter = require('../routes/profilesRoute');
const usersRouter = require('../routes/usersRoute');

const webapp = express();
webapp.use(express.urlencoded({ extended: true }));
webapp.use(express.json());
webapp.use('/', profileRouter);
webapp.use('/', usersRouter);

// connect to the DB
let mongo;

// get a user's profile
describe('GET /profile/:id endpoint tests,', () => {
  let response; // the response frome our express server
  let testId;

  beforeAll(async () => {
    mongo = await connect();
    testId = '638c4bf8cdb37cd8710a5ba0';
    response = await request(webapp).get(`/profile/${testId}`);
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

// Edit a user's profile
describe('PUT /profile/:id endpoint tests', () => {
  let db; // the db
  let response; // the response from our express server
  let originData;
  let testId;
  let loginRes;

  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    db = mongo.db();
    testId = '638c4bf8cdb37cd8710a5ba0';
    const user = await db.collection('User').findOne({
      _id: ObjectId(testId),
    });
    const loginData = {
      email: 'xwang7@seas.upenn.edu',
      password: '123',
    };
    loginRes = await request(webapp).post('/users/login').send(loginData);
    const tokenObj = JSON.parse(loginRes.res.text).token;
    originData = {
      username: user.username,
      password: user.password,
      bio: user.bio,
    };
    // send the request to the API and collect the response
    const requestBody = {
      username: 'xwang7',
      bio: 'students',
      password: '123456',
      followers: user.followers,
      followings: user.followings,
      token: tokenObj,
    };
    response = await request(webapp).put(`/profile/${testId}`).send(requestBody);
    console.log(response.res.text);
  });

  const recoverUserProfile = async () => {
    try {
      const result = await db.collection('User').updateOne(
        { _id: ObjectId(testId) },
        {
          $set: {
            username: originData.username,
            bio: originData.bio,
            password: originData.password,
          },
        },
      );
      console.log('result: ', result);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };
  afterAll(async () => {
    try {
      await recoverUserProfile();
      await mongo.close(); // close the test file connection
      await closeMongoDBConnection(); // close the express connection
    } catch (err) {
      throw new Error(err);
    }
  });

  test('missing token 404', async () => {
    const res = await request(webapp).put(`/profile/${testId}`)
      .send('password=1234567');
    expect(res.status).toEqual(404);
  });

  test('Unauthorized user try to modify the profile', async () => {
    const requestBody = {
      username: 'xwang77',
      bio: 'student',
      password: '123456',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    };
    const testWrongId = '638a68c6b2ce5f62e9e5012222';
    const res = await request(webapp).put(`/profile/${testWrongId}`).send(requestBody);
    expect(res.status).toEqual(404);
  });
});

// Update a user's follow info
describe('PUT /follow endpoint tests', () => {
  let db; // the db
  let response; // the response from our express server
  let followerId;
  let followingId;
  let followerRes;
  let followingRes;
  let follower;
  let following;

  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    db = mongo.db();
    followerId = '638806cbfb91ca4b2f60289a';
    followingId = '638806cbfb91ca4b2f60289b';
    followerRes = await request(webapp).get(`/users/${followerId}`);
    followingRes = await request(webapp).get(`/users/${followingId}`);
    follower = await db.collection('User').findOne({
      _id: ObjectId(followerId),
    });
    following = await db.collection('User').findOne({
      _id: ObjectId(followingId),
    });
    // send the request to the API and collect the response
    const requestBody = {
      followerId,
      followingId,
    };
    response = await request(webapp).put('/follow').send(requestBody);
  });

  const recoverFollowRelation = async () => {
    try {
      const followerResult = await db.collection('User').updateOne(
        { _id: ObjectId(followerId) },
        {
          $set: {
            followings: follower.followings,
          },
        },
      );
      const followingResult = await db.collection('User').updateOne(
        { _id: ObjectId(followingId) },
        {
          $set: {
            followers: following.followers,
          },
        },
      );
      console.log('follower result: ', followerResult);
      console.log('following result: ', followingResult);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  afterAll(async () => {
    try {
      await recoverFollowRelation();
      await mongo.close(); // close the test file connection
      await closeMongoDBConnection(); // close the express connection
    } catch (err) {
      throw new Error(err);
    }
  });

  test('the status code is 200', () => {
    expect(followerRes.status).toBe(200); // status code
    expect(followingRes.status).toBe(200); // status code
    expect(response.type).toBe('application/json');
  });

  test('wrong id 404', async () => {
    const testBody = {
      followerId: '638806cbfb91ca4b2f602892',
      followingId: '638806cbfb91ca4b2f602892',
    };
    response = await request(webapp).put('/follow').send(testBody);
    expect(response.status).toBe(404);
  });

  test('already following 409', async () => {
    const testBody = {
      followerId: '638c4bf8cdb37cd8710a5ba0',
      followingId: '638806cbfb91ca4b2f60289b',
    };
    response = await request(webapp).put('/follow').send(testBody);
    expect(response.status).toBe(409);
  });
});

// Update a user's unfollow info
describe('PUT /unfollow endpoint tests', () => {
  let db; // the db
  let response; // the response from our express server
  let followerId;
  let followingId;
  let followerRes;
  let followingRes;
  let follower;
  let following;

  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    db = mongo.db();
    followerId = '638806cbfb91ca4b2f60289a';
    followingId = '638806cbfb91ca4b2f60289b';
    followerRes = await request(webapp).get(`/users/${followerId}`);
    followingRes = await request(webapp).get(`/users/${followingId}`);
    follower = await db.collection('User').findOne({
      _id: ObjectId(followerId),
    });
    following = await db.collection('User').findOne({
      _id: ObjectId(followingId),
    });
    // send the request to the API and collect the response
    const requestBody = {
      followerId,
      followingId,
    };
    response = await request(webapp).put('/unfollow').send(requestBody);
  });

  const recoverFollowRelation = async () => {
    try {
      const followerResult = await db.collection('User').updateOne(
        { _id: ObjectId(followerId) },
        {
          $set: {
            followings: follower.followings,
          },
        },
      );
      const followingResult = await db.collection('User').updateOne(
        { _id: ObjectId(followingId) },
        {
          $set: {
            followers: following.followers,
          },
        },
      );
      console.log('follower result: ', followerResult);
      console.log('following result: ', followingResult);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  afterAll(async () => {
    try {
      await recoverFollowRelation();
      await mongo.close(); // close the test file connection
      await closeMongoDBConnection(); // close the express connection
    } catch (err) {
      throw new Error(err);
    }
  });

  test('the status code is 200', () => {
    expect(followerRes.status).toBe(200); // status code
    expect(followingRes.status).toBe(200); // status code
    expect(response.type).toBe('application/json');
  });

  test('wrong id 404', async () => {
    const testBody = {
      followerId: '638806cbfb91ca4b2f602892',
      followingId: '638806cbfb91ca4b2f602892',
    };
    response = await request(webapp).put('/unfollow').send(testBody);
    expect(response.status).toBe(404);
  });

  test('already unfollowing 409', async () => {
    const testBody = {
      followerId: '638c4bf8cdb37cd8710a5ba0',
      followingId: '6388320305d016d46329331d',
    };
    response = await request(webapp).put('/unfollow').send(testBody);
    expect(response.status).toBe(409);
  });
});
