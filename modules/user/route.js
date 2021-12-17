const express = require('express');
const router = express.Router();
const userController = require('./controller');
//@route    POST api/users

router.post('/', userController.signUp);

module.exports = router;
