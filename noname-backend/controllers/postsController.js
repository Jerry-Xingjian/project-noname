const console = require('console');
// const jwt = require('jsonwebtoken');
const WebSocket = require('ws');
const dbLib = require('../models/postsModel');

// implement the POST /post endpoint
const newPost = (async (req, res) => {
  console.log('CREATE a post');
  // parse the body of the request
  // check whether the request body have userId and comments
  // todo: check content
  if (!req.body.userId || !req.body.media || !req.body.caption || !req.body.location) {
    res.status(404).json({ message: 'missing userId, media, caption or location.' });
    return;
  }
  // const { JWT_SECRET } = process.env;
  // // JSON web token creation
  // const serverToken = jwt.sign({
  //   name: 'webserver',
  // }, JWT_SECRET, { expiresIn: '1h' });

  // websocket server url
  const url = process.env.NODE_ENV === 'production'
    ? 'wss://noname-test-version-1.herokuapp.com'
    : 'ws://localhost:8080';

  try {
    // create the new user
    const newPostInfo = {
      userId: req.body.userId,
      media: req.body.media,
      caption: req.body.caption,
      location: req.body.location,
    };
    const results = await dbLib.newPost(newPostInfo);
    // Notify WS Server to update all connected clients
    const msg = { type: 'new post', data: results };
    // websocket connection with jwt
    const connection = new WebSocket(url);
    connection.onopen = () => {
      connection.send(JSON.stringify(msg));
    };
    // connection.send(JSON.stringify(msg));
    // send the response with the appropirate status code
    // status 201 means created success
    res.status(201).json({ data: results });
  } catch (err) {
    res.status(409).json({ message: 'there was an error' });
  }
});

const getPostByUserId = (async (req, res) => {
  const { currentUserId } = req.query;
  console.log(`GET posts by user ID by user ${currentUserId}`);
  try {
    const results = await dbLib.getPostByUserId(req.params.id, currentUserId);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ message: 'there was an error' });
  }
});

const editPostByPostId = (async (req, res) => {
  console.log(`UPDATE a post by Post Id ${req.params.id}`);
  try {
    let results;
    if (Object.keys(req.body).length === 1) {
      results = await dbLib.hidePost(req.params.id, req.body.caption);
    } else {
      const inputInfo = {
        caption: req.body.caption,
        location: req.body.location,
        media: req.body.media,
      };
      console.log('updating post');
      results = await dbLib.editPostByPostId(req.params.id, inputInfo);
    }
    console.log(results);
    res.status(201).json({ response: results });
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

const deletePostByPostId = (async (req, res) => {
  console.log(`DELETE a post by Post Id ${req.params.id}`);
  try {
    const results = await dbLib.deletePostByPostId(req.params.id);
    console.log(results);
    res.status(200).json({ response: results });
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

const getActivityFeed = async (req, res) => {
  console.log('GET activity feed');
  const { userId, limit, offset } = req.query;
  try {
    // const allRes = await dbLib.getAllPosts('0', '0');
    const allRes = await dbLib.getFeedByUserId(userId, '0', '0');
    if (parseInt(limit, 10) + parseInt(offset, 10) > allRes.length) {
      // const leftRes = await dbLib.getAllPosts(limit, offset);
      const leftRes = await dbLib.getFeedByUserId(userId, limit, offset);
      res.status(200).json({ status: 'no more posts', response: leftRes });
      return;
    }
    const results = await dbLib.getFeedByUserId(userId, limit, offset);
    res.status(200).json({ response: results });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const getActivityFeedByUserId = async (req, res) => {
  console.log(`GET activity feed by UserId ${req.params.id}`);
  const { limit, offset } = req.query;
  const userId = req.params.id;
  try {
    const allRes = await dbLib.getActivityFeedByUserId(userId, '0', '0');
    if (parseInt(limit, 10) + parseInt(offset, 10) > allRes.length) {
      const leftRes = await dbLib.getActivityFeedByUserId(userId, limit, offset);
      res.status(200).json({ status: 'no more posts', response: leftRes });
      return;
    }
    const results = await dbLib.getActivityFeedByUserId(userId, limit, offset);
    res.status(200).json({ response: results });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const likePost = async (req, res) => {
  console.log('PUT post info for a like');
  if (!req.body.userId || !req.body.postId) {
    res.status(404).json({ message: 'missing userId or postId.' });
    return;
  }
  const { postId, userId } = req.body;
  try {
    const results = await dbLib.likePostByPostId(postId, userId);
    res.status(201).json({ response: results });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const unlikePost = async (req, res) => {
  console.log('PUT post info for an unlike');
  if (!req.body.userId || !req.body.postId) {
    res.status(404).json({ message: 'missing userId or postId.' });
    return;
  }
  const { postId, userId } = req.body;
  try {
    const results = await dbLib.unlikePostByPostId(postId, userId);
    res.status(201).json({ response: results });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const getCommentsByPostId = async (req, res) => {
  console.log('GET comments by post ID');
  try {
    const results = await dbLib.getCommentsByPostId(req.params.postId);
    res.status(200).json({ response: results });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const newComment = async (req, res) => {
  console.log('POST a new comment');
  const { belongPostId, belongUserId, content } = req.body;
  try {
    const result = await dbLib.newComment(belongPostId, belongUserId, content);
    res.status(201).json({ response: result });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const editCommentByCommentId = async (req, res) => {
  console.log('PUT a comment by comment ID');
  if (!req.params.postId || !req.body.commentId) {
    res.status(404).json({ message: 'missing commentId or belongPostId.' });
    return;
  }
  const { commentId, postData } = req.body;
  const { postId } = req.params;
  console.log('edited content', postData.content);
  try {
    const result = await dbLib.editCommentByCommentId(postId, commentId, postData.content);
    res.status(200).json({ response: result });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const deleteCommentByCommentId = async (req, res) => {
  console.log('DELETE a comment by comment ID');
  if (!req.params.commentId || !req.body.belongPostId) {
    res.status(404).json({ message: 'missing commentId or belongPostId.' });
    return;
  }
  const { belongPostId } = req.body;
  try {
    console.log('belong', belongPostId);
    console.log('comment', req.params.commentId);
    const result = await dbLib.deleteCommentByCommentId(belongPostId, req.params.commentId);
    res.status(200).json({ response: result });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

module.exports = {
  newPost,
  getPostByUserId,
  editPostByPostId,
  deletePostByPostId,
  getActivityFeed,
  getActivityFeedByUserId,
  likePost,
  unlikePost,
  getCommentsByPostId,
  newComment,
  editCommentByCommentId,
  deleteCommentByCommentId,
};
