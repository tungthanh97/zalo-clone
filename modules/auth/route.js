const express = require('express');
const router = express.Router();
const authController = require('./controller');
//@route    GET POST api/auth
router.post('/login', authController.login);
router.post('/auto-login', authController.autoLogin);
router.post('/register', authController.register);
router.post('/refresh-token', authController.refreshToken);

// router.get('/user/:username', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     res.json(user);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

module.exports = router;