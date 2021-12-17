const { userValidate } = require('../../validate');
const { tokenUtils } = require('../../utils');
const { AuthenError } = require('../../exception');
const User = require('../user/model');
const config = require('config');
const accessTokenLife = config.get('JWT_LIFE_ACCESS_TOKEN');

class AuthService {
  // [POST] /login
  async login(email, password) {
    userValidate.validateLogin(email, password);

    let user = await User.findOne({ email });
    return await tokenUtils.generateAndUpdateAccessAndRefreshToken(user._id);
  }

  async refreshToken(refreshToken) {
    const { _id } = await tokenUtils.verifyToken(refreshToken);
    const user = await User.findOne({
      _id,
      refreshToken: {
        $elemMatch: { token: refreshToken },
      },
    });
    if (!user) throw new AuthenError();

    return await tokenUtils.generateToken({ _id }, accessTokenLife);
  }
}

module.exports = new AuthService();
