const express = require('express');

const router = express.Router();
const profilesController = require('../controllers/profilesController');

router.get('/get/profile/:id', profilesController.getUserProfileById);
router.put('/edit/profile/:id', profilesController.editUserProfileByUserId);
router.put('/follow', profilesController.updateFollow);
router.put('/unfollow', profilesController.updateUnfollow);
module.exports = router;
