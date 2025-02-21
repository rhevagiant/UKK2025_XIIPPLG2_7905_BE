const express = require('express');
const router = express.Router();
const userController = require('../../Controller/user/userController');
const upload = require('../../multer/uploads');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/uploadPhoto', upload.single('photo'), userController.photoProfile);
router.get('/profile/:id', userController.getUserProfile);
router.post('/logout', userController.logout);

module.exports = router;