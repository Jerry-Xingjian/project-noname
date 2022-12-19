/* eslint-disable no-underscore-dangle */
const { ObjectId } = require('mongodb');
const { getDB } = require('../dbConnection');

const addRcmd = async (userId, remdUsers) => {
  try {
    const db = await getDB();
    const result = await db.collection('Recommendation').insertOne({
      userId: ObjectId(userId),
      remdUsers,
    });

    return result;
  } catch (err) {
    throw new Error(err);
  }
};

// compute recommendations for a user
const updateRecommendations = async (currentUser) => {
  const recommendations = [];
  try {
    const db = await getDB();
    const allUsers = await db.collection('User').find().toArray();

    allUsers.forEach((user) => {
      const commonFollower = currentUser.followings.filter((element) => (
        user.followings.map((e) => `${e}`).includes(`${element}`)
      ));

      if (commonFollower.length >= 3
        && `${currentUser._id}` !== `${user._id}`
        && !user.followers.map((e) => `${e}`).includes(`${currentUser._id}`)
      ) {
        recommendations.push(user);
      }
    });

    if (recommendations.length > 0) {
      await db.collection('Recommendation').updateOne(
        { userId: ObjectId(currentUser._id) },
        { $set: { remdUsers: recommendations } },
      );
    } else {
      const sortedUsers = allUsers.sort((a, b) => b.followers.length - a.followers.length);
      let topUsers = sortedUsers.slice(0, 10);
      topUsers = topUsers.filter((user) => !user.followers.map((e) => `${e}`).includes(`${currentUser._id}`));
      const remdUsers = topUsers.length >= 2 ? topUsers.slice(0, 2) : topUsers;
      await db.collection('Recommendation').updateOne(
        { userId: ObjectId(currentUser._id) },
        { $set: { remdUsers } },
      );
    }
  } catch (err) {
    throw new Error(err);
  }
};

const getUserRcmd = async (userID) => {
  try {
    const db = await getDB();
    const userRes = await db.collection('User').findOne({
      _id: ObjectId(userID),
    });
    await updateRecommendations(userRes);
    const result = await db.collection('Recommendation').findOne(
      { userId: ObjectId(userID) },
    );
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  addRcmd,
  getUserRcmd,
};
