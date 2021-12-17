const authService = require('./service');

class AuthController {
  async login(req, res, next) {
    const { email, password } = req.body;

    try {
      const { token, refreshToken } = await authService.login(email, password);
      res.json({ token, refreshToken });
    } catch (err) {
      next(err);
    }
  }

  // [POST] /refresh-token
  async refreshToken(req, res, next) {
    const { refreshToken } = req.body;

    try {
      const token = await authService.refreshToken(refreshToken);

      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();
