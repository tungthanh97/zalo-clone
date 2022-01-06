const { userValidate } = require('../../validate');
const { tokenUtils } = require('../../utils');
const { AuthenError } = require('../exception');
const User = require('./model');
const gravatar = require('gravatar');

class AuthService {
  // [POST] /login
  async login(phone, password, source) {
    userValidate.validateLogin(phone, password);

    let user = await User.findOne({ phone });
    return await tokenUtils.generateAndUpdateAccessAndRefreshToken(
      user._id,
      source,
    );
  }

  async refreshToken(refreshToken, source) {
    const { _id } = await tokenUtils.verifyToken(refreshToken);
    return await this.checkAndGenerateToken(_id, refreshToken, source);
  }

  async checkAndGenerateToken(_id, token, source) {
    const user = await User.findOne({
      _id,
      refreshToken: {
        $elemMatch: { token: token, source: source },
      },
    });
    if (!user) throw new AuthenError();
    const { accessToken, refreshToken } =
      await tokenUtils.generateAndUpdateAccessAndRefreshToken(user._id, source);

    return { user, accessToken, refreshToken };
  }

  // [POST] /Register
  async register(username, phone, password, source) {
    userValidate.validateRegister(username, phone, password);
    const user = await User.findOne({ phone });

    if (user) {
      throw new BadRequestError('User already exists');
    }

    return await this.addUserToDatabase(username, phone, password, source);
  }

  async addUserToDatabase(username, phone, password, source) {
    // Get users gravatar
    const avatar = gravatar.url(phone, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });

    const user = new User({ username, phone, avatar, password });
    user.password = await this.encryptPassword(password);
    await user.save();
    const { accessToken, refreshToken } =
      await tokenUtils.generateAndUpdateAccessAndRefreshToken(user._id, source);
    return { user, accessToken, refreshToken };
  }

  async encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}

module.exports = new AuthService();
