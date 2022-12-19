import axios from 'axios';
import data from './index';

// Get comments by post id
const getCommentsByPostId = (postId) => axios.get(`${data.rootTemp}/comments/${postId}`);

const deleteComment = (postId, commentId) => axios.put(`${data.rootTemp}/comments/${commentId}`, {
  belongPostId: postId,
});

const addComment = (postData) => axios.post(`${data.rootTemp}/comments`, postData);

const editComment = (postId, commentId, postData) => {
  const res = axios.put(`${data.rootTemp}/comment/${postId}`, {
    commentId,
    postData,
  });
  return res;
};

export {
  getCommentsByPostId, deleteComment, addComment, editComment,
};
