/* eslint-disable no-underscore-dangle */
const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const alert = require('alert');
const console = require('console');
const { getDB } = require('../dbConnection');
const { addRcmd } = require('./rcmd');

// Find the JWT_SECRET inthe document
const { JWT_SECRET } = process.env;

// READ all users
const getAllUser = async () => {
  try {
    const db = await getDB();
    // In this case, there is no filter passed into find
    const result = await db.collection('User').find({}).toArray();
    // print the result
    console.log(`Users: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw new Error(err);
  }
};

// Add default user recommendations
const addDefaultRcmd = async (userId) => {
  const allUsers = await getAllUser();
  // sort by followers number
  const sortedUsers = allUsers.sort((a, b) => b.followers.length - a.followers.length);
  await addRcmd(userId, sortedUsers.slice(0, 2));
};

// Find a user by email
const getUserByEmail = async (userInfo) => {
  const db = await getDB();
  const user = await db.collection('User').findOne({
    email: userInfo.email,
  });
  return user;
};

const login = async (userInfo) => {
  try {
    const user = await getUserByEmail(userInfo);
    if (user == null) {
      // alert('No user match. Check typo');
      throw new Error('No user match. Check typo');
    }
    // if the encrypted password match the plain password
    if (await bcrypt.compare(userInfo.password, user.password)) {
      const token = jwt.sign({
        id: user._id,
      }, JWT_SECRET);
      return token;
    }
    // alert('Password does not match.');
    throw new Error('No token generated. Password does not match.');
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw new Error(err);
  }
};

// register a new user
const register = async (newUser) => {
  try {
    const db = await getDB();
    // db.collection('User').createIndex( { "email": 1 }, { unique: true } )

    const checkDup = await getUserByEmail(newUser);
    if (checkDup != null) {
      console.log(checkDup);
      alert('duplicate username');
      throw new Error('dulplicate username');
    }

    const encryptPassword = await bcrypt.hash(newUser.password, 10);
    const result = await db.collection('User').insertOne({
      email: newUser.email,
      password: encryptPassword,
      username: newUser.username,
      bio: newUser.bio,
      profilePicture: newUser.profilePicture,
      followings: [],
      followers: [],
      createdAt: new Date(),
      updateAt: new Date(),
    });
    const user = await getUserByEmail(newUser);
    const token = jwt.sign({
      id: user._id,
    }, JWT_SECRET);
    await addDefaultRcmd(user._id);
    console.log(`Users: ${JSON.stringify(result)}`);
    return token;
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw new Error(err);
  }
};

// READ a user his/her ID
const getUserByUserId = async (userID) => {
  try {
    const db = await getDB();
    // In this case, we need to filter find by ID
    const result = await db.collection('User').findOne({ _id: ObjectId(userID) });
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw new Error(err);
  }
};

// READ a user's followers
const getFollowersByUserId = async (userID) => {
  try {
    const db = await getDB();
    // In this case, we need to filter find by ID
    // need to import ObjectId
    const result = await db.collection('User').findOne({ _id: ObjectId(userID) });
    // print the result
    console.log(`Followers: ${JSON.stringify(result.followers)}`);
    return result.followers;
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw new Error(err);
  }
};

// Not implemented in controller yet
// DELETE a user his/her ID
const deleteUserByUserId = async (userID) => {
  try {
    const db = await getDB();
    // In this case, we need to filter find by ID
    const result = await db.collection('User').deleteOne(
      { _id: ObjectId(userID) },
    );
    // result is a record
    // print the result
    console.log(`User: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw new Error(err);
  }
};

const searchUser = async (searchTerm) => {
  try {
    const db = await getDB();
    const result = await db.collection('User').find({
      username: { $regex: `^${searchTerm}`, $options: 'i' },
    }).limit(5).toArray();
    console.log(`Users: ${JSON.stringify(result)}`);
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw new Error(err);
  }
};

// export the functions
module.exports = {
  login,
  register,
  getAllUser,
  getUserByUserId,
  getFollowersByUserId,
  deleteUserByUserId,
  searchUser,
};
