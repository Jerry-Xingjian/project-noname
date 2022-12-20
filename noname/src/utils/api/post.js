import axios from 'axios';
import data from './index';

const getPostsByUserId = async (userId, currentUserId) => {
  try {
    const response = await axios.get(`${data.rootTemp}/posts/${userId}?currentUserId=${currentUserId}`);
    // console.log('get posts by id');
    return response;
  } catch (err) {
    throw new Error(err);
  }
};

const addPost = async (userId, media, caption, location) => {
  try {
    const response = await axios.post(`${data.rootTemp}/posts`, {
      userId,
      // content need to be updated here with a post details
      media,
      caption,
      location,
    });
    // console.log('add post');
    return response;
  } catch (err) {
    throw new Error(err);
  }
};
// Delete a post
const deletePost = (postId) => axios.delete(`${data.rootTemp}/post/${postId}`);

// Get post by post id
const getPostByPostId = (postId) => axios.get(`${data.root}/post/${postId}`);

// Update a post
const updatePost = (postId, caption = undefined, location = undefined, media = undefined, userId = undefined) => axios.put(`${data.rootTemp}/post/${postId}`, {
  // content need to be updated here with a post details
  caption,
  location,
  media,
  userId,
});

// Like a post
const likePost = (postId, userId) => axios.put(`${data.rootTemp}/like`, {
  postId,
  userId,
});

const unlikePost = (postId, userId) => axios.put(`${data.rootTemp}/unlike`, {
  postId,
  userId,
});

export {
  getPostsByUserId,
  addPost,
  deletePost,
  getPostByPostId,
  updatePost,
  likePost,
  unlikePost,
};
