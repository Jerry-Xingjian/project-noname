import axios from 'axios';
import data from './index';

// Get activity feed
const getActivityFeed = (userId, limit = 20, offset = 0) => {
  try {
    const res = axios.get(`${data.rootTemp}/activity_feed?userId=${userId}&limit=${limit}&offset=${offset}`);
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

// Get activity feed by user id
const getActivityFeedByUserId = (userId, limit = 20, offset = 0) => {
  try {
    const res = axios.get(`${data.rootTemp}/activity_feed/${userId}?limit=${limit}&offset=${offset}`);
    return res;
  } catch (err) {
    throw new Error(err);
  }
};

export {
  getActivityFeed,
  getActivityFeedByUserId,
};
