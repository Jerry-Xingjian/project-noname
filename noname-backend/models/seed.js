/* eslint-disable no-underscore-dangle */
require('dotenv').config();
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
// eslint-disable-next-line import/no-extraneous-dependencies
const { ObjectID } = require('bson');
const { connect, getDB, closeMongoDBConnection } = require('../dbConnection');
const { getAllUser } = require('./usersModel');

let allUsers = [];

// Create 30 users
async function createUsers(db) {
  try {
    // Connect to and get the database
    const userCollection = db.collection('User');
    const data = [];
    const usersNum = 10;

    new Array(usersNum).fill(0).forEach(() => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const password = faker.internet.password();
      const encryptedPassword = bcrypt.hashSync(password, 10);
      const newUser = {
        email: faker.internet.email(firstName, lastName),
        password: encryptedPassword,
        username: faker.internet.userName(firstName, lastName),
        bio: faker.lorem.sentence(),
        profilePicture: faker.image.avatar(),
        followings: [],
        followers: [],
        createdAt: faker.date.recent(10),
        updateAt: faker.date.recent(1),
      };
      data.push(newUser);
    });

    userCollection.drop();
    // allUsers.push(...data);
    await userCollection.insertMany(data);
  } catch (err) {
    throw new Error(`Error occurs when seeding users: ${err.message}`);
  }
}

const generateRandomUserId = () => {
  const randomNum = faker.datatype.number(allUsers.length - 1);
  const randomUserId = allUsers[randomNum]._id;
  return `${randomUserId}`;
};

const generateUserFollowings = async (user) => {
  const profile = user;

  // generate random number of followers and followees
  const randomFollowerCount = faker.datatype.number({ min: 2, max: 4 });
  const randomFollowingCount = faker.datatype.number({ min: 2, max: 4 });
  const followers = faker.helpers.uniqueArray(generateRandomUserId, randomFollowerCount);
  const followings = faker.helpers.uniqueArray(generateRandomUserId, randomFollowingCount);

  // filter out the user itself
  const filteredFollowers = followers.filter((follower) => `${follower}` !== `${profile._id}`);
  const filteredFollowings = followings.filter((following) => `${following}` !== `${profile._id}`);

  // update the user's followers and followings
  profile.followings = [...new Set([...profile.followings, ...filteredFollowings].map((f) => `${f}`))].map((f) => ObjectID(f));
  profile.followers = [...new Set([...profile.followers, ...filteredFollowers].map((f) => `${f}`))].map((f) => ObjectID(f));

  // update the followings' followers
  filteredFollowings.forEach((following) => {
    const followingIndex = allUsers.findIndex((crr) => `${crr._id}` === `${following}`);
    const followingProfile = allUsers.find((crr) => `${crr._id}` === `${following}`);
    followingProfile.followers.push(profile._id);
    const dropdupFollowers = [...new Set(followingProfile.followers.map((f) => `${f}`))].map((f) => ObjectID(f));
    followingProfile.followers = dropdupFollowers;
    allUsers[followingIndex] = followingProfile;
  });

  // update the followers' followings
  filteredFollowers.forEach(async (follower) => {
    const followerIndex = allUsers.findIndex((crr) => `${crr._id}` === `${follower}`);
    const followerProfile = allUsers.find((crr) => `${crr._id}` === `${follower}`);
    followerProfile.followings.push(profile._id);
    const dropdupFollowings = [...new Set(followerProfile.followings.map((f) => `${f}`))].map((f) => ObjectID(f));
    followerProfile.followings = dropdupFollowings;
    allUsers[followerIndex] = followerProfile;
  });
};

// generate followings and followers for each user
async function seedUsersFollows(db) {
  try {
    const userCollection = db.collection('User');
    allUsers = await getAllUser();
    allUsers.forEach(async (user) => {
      generateUserFollowings(user);
    });
    userCollection.drop();
    await userCollection.insertMany(allUsers);
  } catch (err) {
    throw new Error(`Error occurs when seeding users' follows: ${err.message}`);
  }
}

// compute recommendations for a user
const computeRecommendations = (currentUser) => {
  const recommendations = [];

  allUsers.forEach((user) => {
    const commonFollower = currentUser.followings.filter((element) => (
      user.followings.map((e) => `${e}`).includes(`${element}`)
    ));

    if (commonFollower.length >= 3
      && `${currentUser._id}` !== `${user._id}`
      && !user.followings.includes(currentUser._id)
    ) {
      recommendations.push(user);
    }
  });

  return recommendations;
};

// create recommendations for each user
async function createRmds(db) {
  try {
    const userRmdCollection = db.collection('Recommendation');
    const allRmds = [];

    allUsers.forEach(async (user) => {
      const recommendations = computeRecommendations(user);
      allRmds.push({
        userId: user._id,
        remdUsers: recommendations,
      });
    });

    userRmdCollection.insertMany(allRmds);
  } catch (err) {
    throw new Error(`Error occurs when seeding users' recommendations: ${err.message}`);
  }
}

// generate random posts for random users
async function createPosts(db) {
  try {
    const postCollection = db.collection('Post');
    const data = [];
    allUsers = await getAllUser();
    for (let i = 0; i < 60; i += 1) {
      const randomNum = faker.datatype.number({ min: 0, max: allUsers.length - 1 });
      const randomUserId = allUsers[randomNum]._id;
      const randomNumMedia = faker.datatype.number({ min: 1, max: 5 });
      const media = [];
      // generate random media images
      for (let j = 0; j < randomNumMedia; j += 1) {
        media.push({
          url: faker.image.imageUrl(),
          type: 'image',
        });
      }

      // generate random post
      const post = {
        belongUserId: randomUserId,
        likeInfo: [],
        media,
        caption: faker.lorem.sentence(),
        comments: [],
        createdAt: faker.date.recent(10),
        updateAt: faker.date.recent(1),
        location: faker.address.city(),
      };
      data.push(post);
    }

    postCollection.drop();
    await postCollection.insertMany(data);
  } catch (err) {
    throw new Error(`Error occurs when seeding posts: ${err.message}`);
  }
}

// main function to seed all data
async function seedAll() {
  try {
    await connect();
    const db = await getDB();
    await createUsers(db);
    await seedUsersFollows(db);
    await createRmds(db);
    await createPosts(db);
    await closeMongoDBConnection();
  } catch (err) {
    throw new Error(`Error occurs when seeding all: ${err.message}`);
  }
}

seedAll();
