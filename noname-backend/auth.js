// import jwt
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { getDB } = require('./dbConnection');

const authenticateUser = async (token, key) => {
  const dbLib = await getDB();
  // check the params
  if (token === null || key === null || !key) {
    return false;
  }
  try {
    const decoded = jwt.verify(token, key);
    // verify the user id
    const id = await dbLib.collection('User').findOne({ _id: ObjectId(decoded.id) });
    // check the user
    if (id) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};

module.exports = { authenticateUser };
