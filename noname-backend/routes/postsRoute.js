const express = require('express');

const router = express.Router();
const postsController = require('../controllers/postsController');

router.post('/posts/newposts', postsController.newPost);
router.put('/post/:id', postsController.editPostByPostId);
router.delete('/post/:id', postsController.deletePostByPostId);
router.get('/posts/:id', postsController.getPostByUserId);
router.get('/activity_feed', postsController.getActivityFeed);
router.get('/activity_feed/:id', postsController.getActivityFeedByUserId);
router.put('/like', postsController.likePost);
router.put('/unlike', postsController.unlikePost);
router.get('/comments/:postId', postsController.getCommentsByPostId);
router.put('/comment/:postId', postsController.editCommentByCommentId);
router.put('/comments/:commentId', postsController.deleteCommentByCommentId);
router.post('/comments', postsController.newComment);

module.exports = router;
