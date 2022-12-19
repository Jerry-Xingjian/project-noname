const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const console = require('console');
const { getDB } = require('../dbConnection');
// Find the JWT_SECRET in the document
const { JWT_SECRET } = process.env;

const getUserProfileById = async (userId) => {
  try {
    const db = await getDB();
    const belongPosts = await db.collection('Post').find({ belongUserId: ObjectId(userId) }).toArray();
    const userInfo = await db.collection('User').findOne({ _id: ObjectId(userId) });
    return { userInfo, belongPosts };
  } catch (err) {
    throw new Error(err);
  }
};

const updateFollow = async (followerId, followingId) => {
  try {
    const db = await getDB();
    const follower = await db.collection('User').findOne({
      _id: ObjectId(followerId),
    });
    const following = await db.collection('User').findOne({
      _id: ObjectId(followingId),
    });
    follower.followings.push(ObjectId(followingId));
    following.followers.push(ObjectId(followerId));
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
    return [followerResult, followingResult];
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw new Error(err);
  }
};

const updateUnfollow = async (followerId, followingId) => {
  try {
    const db = await getDB();
    const follower = await db.collection('User').findOne({
      _id: ObjectId(followerId),
    });
    const following = await db.collection('User').findOne({
      _id: ObjectId(followingId),
    });
    follower.followings = follower.followings.filter((i) => `${i}` !== `${followingId}`);
    following.followers = following.followers.filter((i) => `${i}` !== `${followerId}`);
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
    return [followerResult, followingResult];
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw new Error(err);
  }
};

// Edit user info by token
const editUserProfileByUserId = async (userID, userInfo) => {
  console.log('userinfo from profile model', userInfo);
  try {
    const db = await getDB();
    const token = jwt.verify(userInfo.token, JWT_SECRET);
    // verify userID is correct
    if (userID !== token.id) {
      throw new Error('Wrong user. Not authorized to edit profile');
    }
    const user = await db.collection('User').findOne({
      _id: ObjectId(token.id),
    });

    // Use token to retrieve the id of the user
    // no longer need to use userID input
    // eslint-disable-next-line no-underscore-dangle
    // check whether input password is the same as the old password
    if (userInfo.password) {
      // const newPassword = await bcrypt.hash(userInfo.password, 10);
      if (!await bcrypt.compare(userInfo.password, user.password)) {
        const result = await db.collection('User').updateOne(
          { _id: ObjectId(userID) },
          {
            $set: {
              username: userInfo.username == null ? user.username : userInfo.username,
              bio: userInfo.bio == null ? user.bio : userInfo.bio,
              profilePicture: userInfo.profilePicture,
              // password: newPassword,
              // followers: userInfo.followers,
              // followings: userInfo.followings,
            },
          },
        );
        console.log(`User: ${JSON.stringify(result)}`);
        return result;
      }
      throw new Error('Type the same password');
    // if user input password is null
    } else {
      const result = await db.collection('User').updateOne(
        { _id: ObjectId(userID) },
        {
          $set: {
            username: userInfo.username == null ? user.username : userInfo.username,
            bio: userInfo.bio == null ? user.bio : userInfo.bio,
            // followers: userInfo.followers,
            // followings: userInfo.followings,
            profilePicture: userInfo.profilePicture,
          },
        },
      );
      console.log(`User: ${JSON.stringify(result)}`);
      return result;
    }
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw new Error(err);
  }
};

module.exports = {
  getUserProfileById,
  editUserProfileByUserId,
  updateFollow,
  updateUnfollow,
};
