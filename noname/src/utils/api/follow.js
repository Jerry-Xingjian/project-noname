import axios from 'axios';
import data from './index';

// Follow a user
const follow = (followerId, followingId) => axios.put(`${data.rootTemp}/follow`, {
  followerId,
  followingId,
});

// Unfollow
const unfollow = (followerId, followingId) => axios.put(`${data.rootTemp}/unfollow`, {
  followerId,
  followingId,
});

// Get followings by user id
const getFollowingsByUserId = (userId) => axios.get(`${data.root}/followings/${userId}`);

// Get followers by user id
const getFollowersByUserId = (userId) => axios.get(`${data.root}/followers/${userId}`);

// Check if user is followed by current user
const getFollowStatus = (currentUserId, checkedUserId) => axios.get(`${data.root}/checkfollower`, {
  currentUserId,
  checkedUserId,
});

export {
  follow, unfollow, getFollowingsByUserId, getFollowersByUserId, getFollowStatus,
};
