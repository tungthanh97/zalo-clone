const userService = require('./service');

class UserController {
  async signUp(req, res, next) {
    const { name, email, password } = req.body;

    try {
      const { token, refreshToken } = await userService.signUp(
        name,
        email,
        password,
      );

      res.json({ token, refreshToken });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
