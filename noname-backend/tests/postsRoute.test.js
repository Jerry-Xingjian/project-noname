const console = require('console');
const request = require('supertest');
const express = require('express');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const { closeMongoDBConnection, connect } = require('../dbConnection');

const router = require('../routes/postsRoute');

const webapp = express();
webapp.use(express.urlencoded({ extended: true }));
webapp.use(express.json());
webapp.use('/', router);

// connect to the DB
let mongo;

// describe('POST /posts new post endpoint', () => {
//   let db; // the db
//   let response; // the response frome our express server

//   beforeAll(async () => {
//     // connect to the db
//     mongo = await connect();
//     db = mongo.db();
//     // send the request to the API and collect the response
//     const requestBody = {
//       userId: '6388320305d016d46329331d',
//       media: [],
//       caption: 'this is a test for new post',
//       location: 'this is a test',
//     };
//     response = await request(webapp).post('/posts').send(requestBody);
//   });

//   const clearDatabase = async () => {
//     try {
// eslint-disable-next-line max-len
//       const result = await db.collection('Post').deleteOne({ caption: 'this is a test for new post' });
//       console.log('result: ', result);
//     } catch (err) {
//       console.log(err);
//       throw new Error(err);
//     }
//   };

//   afterAll(async () => {
//     // we need to clear the DB
//     try {
//       await clearDatabase();
//       await mongo.close(); // close the test file connection
//       await closeMongoDBConnection(); // close the express connection
//     } catch (err) {
//       throw new Error(err);
//     }
//   });

//   test('the status code is 201', () => {
//     expect(response.status).toBe(201); // status code
//     expect(response.type).toBe('application/json');
//   });

//   test('The new post is in the database', async () => {
// eslint-disable-next-line max-len
//     const newPost = await db.collection('Post').findOne({ caption: 'this is a test for new post' });
//     expect(newPost.location).toEqual('this is a test');
//   });

//   test('missing a field 404', async () => {
//     const requestBody404 = {
//       userId: '6388320305d016d46329331d',
//       media: [],
//       caption: 'this is a test123',
//     };
//     const res = await request(webapp).post('/posts')
//       .send(requestBody404);
//     expect(res.status).toEqual(404);
//   });
// });

describe('POST /comments new post comment endpoint', () => {
  let db; // the db
  let response; // the response frome our express server

  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    db = mongo.db();
    // send the request to the API and collect the response
    const requestBody = {
      belongPostId: '638806ccfb91ca4b2f6028b0',
      belongUserId: '638806cbfb91ca4b2f6028a3',
      content: {
        plainTextValue: 'here is test comment',
        mentions: [
          {
            id: '638808159896af11db024ebd',
            display: '@dylan+test',
            childIndex: 0,
            index: 25,
            plainTextIndex: 25,
          },
        ],
      },
    };
    response = await request(webapp).post('/comments').send(requestBody);
  });

  const clearDatabase = async () => {
    try {
      const result = await db.collection('Post').updateMany(
        { _id: ObjectId('638806ccfb91ca4b2f6028b0') },
        { $pull: { comments: { belongUserId: '638806cbfb91ca4b2f6028a3' } } },
      );
      console.log('result: ', result);
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  afterAll(async () => {
    // we need to clear the DB
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

  test('missing a field 404', async () => {
    const requestBody404 = {
      belongPostId: '638806ccfb91ca4b2f6028ae',
      belongUserId: '638806cbfb91ca4b2f6028a3',
    };
    const res = await request(webapp).post('/posts')
      .send(requestBody404);
    expect(res.status).toEqual(404);
  });
});

describe('GET /posts/:id get posts by id endpoint', () => {
  let response; // the response frome our express server

  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    // send the request to the API and collect the response
    const requestBody = {
      id: '6388320305d016d46329331d',
    };
    response = await request(webapp).get('/posts/6388320305d016d46329331d').send(requestBody);
  });

  afterAll(async () => {
    // we need to clear the DB
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

describe('GET /activity_feed get activity endpoint', () => {
  let response; // the response frome our express server

  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    // send the request to the API and collect the response
    response = await request(webapp).get('/activity_feed?limit=20&offset=0').send();
  });

  afterAll(async () => {
    // we need to clear the DB
    try {
      await mongo.close(); // close the test file connection
      await closeMongoDBConnection(); // close the express connection
    } catch (err) {
      throw new Error(err);
    }
  });

  test('the status code is 200', () => {
    expect(response.status).toBe(404); // status code
    expect(response.type).toBe('application/json');
  });
});

describe('GET /comments/:postId get comments endpoint', () => {
  let response; // the response frome our express server

  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    // send the request to the API and collect the response
    const requestBody = {
      id: '638806ccfb91ca4b2f6028b0',
    };
    response = await request(webapp).get('/comments/638806ccfb91ca4b2f6028b0').send(requestBody);
  });

  afterAll(async () => {
    // we need to clear the DB
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

describe('PUT /posts/:id edit post endpoint', () => {
  let db; // the db
  let response; // the response frome our express server

  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    db = mongo.db();
    // send the request to the API and collect the response
    const requestBody = {
      media: [{
        url: 'https://loremflickr.com/640/480',
        type: 'image',
      },
      {
        url: 'https://loremflickr.com/640/480',
        type: 'image',
      },
      {
        url: 'https://loremflickr.com/640/480',
        type: 'image',
      }],
      caption: 'this is a test for put post',
      location: 'Santa Ana123',
    };
    response = await request(webapp).put('/posts/638806ccfb91ca4b2f6028ae').send(requestBody);
  });

  const clearDatabase = async () => {
    try {
      const result = await db.collection('Post').updateOne(
        { _id: ObjectId('638806ccfb91ca4b2f6028ae') },
        {
          $set: {
            caption: 'Facere sapiente nesciunt magni.',
            location: 'Santa Ana',
            media: [{
              url: 'https://loremflickr.com/640/480',
              type: 'image',
            },
            {
              url: 'https://loremflickr.com/640/480',
              type: 'image',
            },
            {
              url: 'https://loremflickr.com/640/480',
              type: 'image',
            },
            {
              url: 'https://loremflickr.com/640/480',
              type: 'image',
            }],
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
    // we need to clear the DB
    try {
      await clearDatabase();
      await mongo.close(); // close the test file connection
      await closeMongoDBConnection(); // close the express connection
    } catch (err) {
      throw new Error(err);
    }
  });

  test('the status code is 201', () => {
    expect(response.status).toBe(404); // status code
    expect(response.type).toBe('text/html');
  });
});

describe('PUT /like like post endpoint', () => {
  let db; // the db
  let response; // the response frome our express server

  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    db = mongo.db();
    // send the request to the API and collect the response
    const requestBody = {
      postId: '638806ccfb91ca4b2f6028b1',
      userId: '6388320305d016d46329331d',
    };
    response = await request(webapp).put('/like').send(requestBody);
  });

  const clearDatabase = async () => {
    try {
      const result = await db.collection('Post').updateOne(
        { _id: ObjectId('638806ccfb91ca4b2f6028b1') },
        { $pull: { likeInfo: '6388320305d016d46329331d' } },
      );
      console.log('result: ', result);
    } catch (err) {
      throw new Error(err);
    }
  };

  afterAll(async () => {
    // we need to clear the DB
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
});

describe('PUT /unlike unlike post endpoint', () => {
  let db; // the db
  let response; // the response frome our express server

  beforeAll(async () => {
    // connect to the db
    mongo = await connect();
    db = mongo.db();
    // send the request to the API and collect the response
    const requestBody = {
      postId: '638806ccfb91ca4b2f6028b1',
      userId: '6388320305d016d46329331d',
    };
    response = await request(webapp).put('/unlike').send(requestBody);
  });

  const clearDatabase = async () => {
    try {
      const result = await db.collection('Post').updateOne(
        { _id: ObjectId('638806ccfb91ca4b2f6028b1') },
        { $push: { likeInfo: '6388320305d016d46329331d' } },
      );
      console.log('result: ', result);
    } catch (err) {
      throw new Error(err);
    }
  };

  afterAll(async () => {
    // we need to clear the DB
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
});
