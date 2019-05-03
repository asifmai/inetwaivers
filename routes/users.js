var express = require('express');
var router = express.Router();
const userController = require('../controllers/userscontroller');

// POST, Public : Register User
router.post('/register', userController.register_post);

// POST, Private : Login User
router.post('/login', userController.login_post);

// GET, Private : Log out User
router.get('/logout', userController.logout_get);

module.exports = router;
