/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
// import ObjectID
const { ObjectId } = require('mongodb');
const console = require('console');
const { ObjectID } = require('bson');
const { getDB } = require('../dbConnection');

const newPost = async (newPostInfo) => {
  try {
    const db = await getDB();
    const result = await db.collection('Post').insertOne({
      belongUserId: ObjectId(newPostInfo.userId),
      likeInfo: [],
      media: newPostInfo.media,
      caption: newPostInfo.caption,
      comments: [],
      createdAt: new Date(),
      updateAt: new Date(),
      location: newPostInfo.location,
    });
    const post = await db.collection('Post').findOne({ _id: result.insertedId });
    return post;
  } catch (err) {
    console.log(`error: ${err.message}`);
    throw new Error(err);
  }
};

const getPostByUserId = async (userId, currentUserId) => {
  try {
    const db = await getDB();
    let result;
    if (userId === currentUserId) {
      result = await db.collection('Post').find({ belongUserId: ObjectId(userId) }).toArray();
    } else {
      result = await db.collection('Post').find({ $and: [{ belongUserId: ObjectId(userId) }, { hideFrom: { $ne: ObjectId(currentUserId) } }] }).toArray();
    }
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

const getFeedByUserId = async (userId, limit, offset) => {
  try {
    const db = await getDB();
    const user = await db.collection('User').findOne({ _id: ObjectId(userId) });
    const userFollowings = user.followings;
    const result = await db.collection('Post')
      // eslint-disable-next-line max-len
      .find({ $and: [{ belongUserId: { $in: userFollowings } }, { hideFrom: { $ne: ObjectId(userId) } }] })
      .skip(parseInt(offset, 10))
      .limit(parseInt(limit, 10))
      .toArray();
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

const editPostByPostId = async (postId, inputInfo) => {
  try {
    const db = await getDB();
    const post = await db.collection('Post').findOne({ _id: ObjectId(postId) });
    await db.collection('Post').updateOne(
      { _id: ObjectId(postId) },
      {
        $set: {
          caption: inputInfo.caption == null ? post.caption : inputInfo.caption,
          location: inputInfo.location == null ? post.location : inputInfo.location,
          media: inputInfo.media == null ? post.media : inputInfo.media,
          updateAt: new Date(),
        },
      },
    );
    const editedPost = await db.collection('Post').findOne({ _id: ObjectId(postId) });
    return editedPost;
  } catch (err) {
    throw new Error(err);
  }
};

const hidePost = async (postId, userId) => {
  // console.log('hiding a post from user');
  try {
    const db = await getDB();
    // const post = await db.collection('Post').findOne({ _id: ObjectId(postId) });
    await db.collection('Post').updateOne(
      { _id: ObjectId(postId) },
      {
        $push: {
          hideFrom: ObjectId(userId),
        },
        $set: {
          updateAt: new Date(),
        },
      },
    );
    const editedPost = await db.collection('Post').findOne({ _id: ObjectId(postId) });
    return editedPost;
  } catch (err) {
    throw new Error(err);
  }
};

const deletePostByPostId = async (postId) => {
  try {
    const db = await getDB();
    const post = await db.collection('Post').deleteOne({ _id: ObjectId(postId) });
    return post;
  } catch (err) {
    throw new Error(err);
  }
};

const likePostByPostId = async (postId, userId) => {
  try {
    const db = await getDB();
    const post = await db.collection('Post').findOne({ _id: ObjectId(postId) });
    post.likeInfo.push(ObjectId(userId));
    await db.collection('Post').updateOne(
      { _id: ObjectId(postId) },
      {
        $set: {
          likeInfo: post.likeInfo,
          updateAt: new Date(),
        },
      },
    );
    const editedPost = await db.collection('Post').findOne({ _id: ObjectId(postId) });
    return editedPost;
  } catch (err) {
    throw new Error(err);
  }
};

const unlikePostByPostId = async (postId, userId) => {
  try {
    const db = await getDB();
    const post = await db.collection('Post').findOne({ _id: ObjectId(postId) });
    post.likeInfo = post.likeInfo.filter((i) => `${i}` !== userId);
    await db.collection('Post').updateOne(
      { _id: ObjectId(postId) },
      {
        $set: {
          likeInfo: post.likeInfo,
          updateAt: new Date(),
        },
      },
    );
    const editedPost = await db.collection('Post').findOne({ _id: ObjectId(postId) });
    return editedPost;
  } catch (err) {
    throw new Error(err);
  }
};

const getAllPosts = async (limit, offset) => {
  try {
    const db = await getDB();
    const posts = await db.collection('Post')
      .find()
      .skip(parseInt(offset, 10))
      .limit(parseInt(limit, 10))
      .toArray();
    return posts;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const getActivityFeedByUserId = async (userId, limit, offset) => {
  try {
    const db = await getDB();
    const posts = await db.collection('Post')
      .find({ hideFrom: { $ne: ObjectId(userId) } })
      .skip(parseInt(offset, 10))
      .limit(parseInt(limit, 10))
      .toArray();
    return posts;
  } catch (err) {
    throw new Error(err);
  }
};

// const updateAllPosts = async () => {
//   try {
//     const db = await getDB();
//     const posts = await db.collection('Post').updateMany({}, {$set:{"hideFrom": []}})
//     return posts;
//   } catch (err) {
//     throw new Error(err);
//   }
// };

const getCommentsByPostId = async (postId) => {
  try {
    const db = await getDB();
    const post = await db.collection('Post').findOne({ _id: ObjectId(postId) });
    return post.comments;
  } catch (err) {
    throw new Error(err);
  }
};

const newComment = async (postId, userId, content) => {
  try {
    const db = await getDB();
    const id = new ObjectID();
    console.log(`new comment id: ${id}`);
    const post = await db.collection('Post').findOne({ _id: ObjectId(postId) });
    post.comments.push({
      _id: id,
      belongUserId: ObjectId(userId),
      content,
      createdAt: new Date(),
      updateAt: new Date(),
    });
    await db.collection('Post').updateOne(
      { _id: ObjectId(postId) },
      {
        $set: {
          comments: post.comments,
        },
      },
    );
    const editedPost = await db.collection('Post').findOne({ _id: ObjectId(postId) });
    return editedPost;
  } catch (err) {
    throw new Error(err);
  }
};

const editCommentByCommentId = async (postId, commentId, content) => {
  try {
    const db = await getDB();
    // const post = await db.collection('Post').findOne({ _id: ObjectId(postId) });
    // const comment = post.comments.find((i) => `${i._id}` === commentId);
    // comment.content = content;
    // comment.updateAt = new Date();
    await db.collection('Post').updateOne(
      // eslint-disable-next-line quotes
      { _id: ObjectId(postId), "comments._id": ObjectId(commentId) },
      {
        $set: {
          'comments.$.content': content,
          'comments.$.updateAt': new Date(),
        },
      },
    );
    const editedPost = await db.collection('Post').findOne({ _id: ObjectId(postId) });
    return editedPost;
  } catch (err) {
    throw new Error(err);
  }
};

const deleteCommentByCommentId = async (postId, commentId) => {
  try {
    const db = await getDB();
    const post = await db.collection('Post').findOne({ _id: ObjectId(postId) });
    post.comments = post.comments.filter((i) => `${i._id}` !== commentId);
    await db.collection('Post').updateOne(
      { _id: ObjectId(postId) },
      {
        $set: {
          comments: post.comments,
        },
      },
    );
    console.log('post.comments', post.comments);
    const editedPost = await db.collection('Post').findOne({ _id: ObjectId(postId) });
    console.log('editedPost', editedPost);
    return editedPost;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  newPost,
  getPostByUserId,
  editPostByPostId,
  hidePost,
  deletePostByPostId,
  getAllPosts,
  getActivityFeedByUserId,
  // updateAllPosts,
  likePostByPostId,
  unlikePostByPostId,
  getCommentsByPostId,
  newComment,
  editCommentByCommentId,
  deleteCommentByCommentId,
  getFeedByUserId,
};
