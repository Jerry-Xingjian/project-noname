const console = require('console');
const dbLib = require('../models/profilesModel');

const getUserProfileById = (async (req, res) => {
  console.log('Get user profile by Id');
  try {
    const results = await dbLib.getUserProfileById(req.params.id);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was an error' });
  }
});

const editUserProfileByUserId = (async (req, res) => {
  console.log('Update the profile of the user');
  if (!req.body.token) {
    res.status(404).json({ message: 'missing token' });
    return;
  }

  try {
    // create the new user
    const updateUser = {
      bio: req.body.bio,
      // followers: req.body.followers,
      // followings: req.body.followings,
      profilePicture: req.body.profilePicture,
      username: req.body.username,
      password: req.body.password,
      token: req.body.token,
    };
    const results = await dbLib.editUserProfileByUserId(req.params.id, updateUser);
    // send the response with the appropirate status code
    // status 201 means created success
    res.status(200).json({ response: results });
  } catch (err) {
    res.status(404).json({ message: 'there was an error' });
  }
});

const updateFollow = async (req, res) => {
  const { followerId, followingId } = req.body;
  const { userInfo } = await dbLib.getUserProfileById(followerId);
  if (userInfo == null) {
    res.status(404).json({ message: 'wrong followerId' });
    return;
  }

  if (userInfo.followings.map((e) => `${e}`).includes(followingId)) {
    res.status(409).json({ message: 'already following' });
    return;
  }

  try {
    const results = await dbLib.updateFollow(followerId, followingId);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'error when updating follow' });
  }
};

const updateUnfollow = async (req, res) => {
  const { followerId, followingId } = req.body;
  const { userInfo } = await dbLib.getUserProfileById(followerId);
  if (userInfo == null) {
    res.status(404).json({ message: 'wrong followerId' });
    return;
  }

  if (!userInfo.followings.map((e) => `${e}`).includes(followingId)) {
    res.status(409).json({ message: 'already not following' });
    return;
  }

  try {
    const results = await dbLib.updateUnfollow(req.body.followerId, req.body.followingId);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'error when updating unfollow' });
  }
};

module.exports = {
  getUserProfileById,
  editUserProfileByUserId,
  updateFollow,
  updateUnfollow,
};
