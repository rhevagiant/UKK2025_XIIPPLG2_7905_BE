const express = require('express');
const router = express.Router();
const userController = require('../../Controller/user/userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile/:id', userController.getUserProfile);
router.post('/logout', userController.logout);

module.exports = router;