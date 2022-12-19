const express = require('express');

const router = express.Router();

const usersController = require('../controllers/usersController');

router.get('/', usersController.welcome);
router.get('/users', usersController.getUsers);
router.get('/users/:id', usersController.getUsersById);
router.get('/users/:id/followers', usersController.getFollowersByUserId);
router.get('/rcmd/:userId', usersController.getUserRcmd);
router.post('/users/register', usersController.creatUser);
router.post('/users/login', usersController.loginUser);
router.get('/search/users', usersController.searchUser);

module.exports = router;
