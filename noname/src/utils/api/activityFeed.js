import axios from 'axios';
import data from './index';

// Get activity feed
const getActivityFeed = (limit = 20, offset = 0) => {
  try {
    const res = axios.get(`${data.rootTemp}/activity_feed?limit=${limit}&offset=${offset}`);
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

// Get activity feed by user id
const getActivityFeedByUserId = (userId) => axios.get(`${data.root}/activity_feed/${userId}`);

const newPost = async (caption, location = 'Philly') => {
  try {
    const response = await axios.post(`${data.root}/activity_feed`, { caption, location });
    // const response = await axios.post(`${data.rootTemp}/posts`, { caption, location });
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

const editPost = (postId, caption, images, location) => axios.put(`${data.root}/activity_feed/${postId}`, { caption, images, location });

const deletePost = (postId) => axios.delete(`${data.root}/activity_feed/${postId}`);

export {
  getActivityFeed,
  getActivityFeedByUserId,
  editPost,
  deletePost,
  newPost,
};
