const { userValidate } = require('../../validate');
const { tokenUtils } = require('../../utils');
const User = require('./model');
const bcrypt = require('bcryptjs');
const { BadRequestError } = require('../../exception');
const gravatar = require('gravatar');

class UserService {
  // [POST] /signUp
  async signUp(name, email, password) {
    const user = await User.findOne({ email });
    userValidate.validateSignup(name, email, password);
    if (user) {
      throw new BadRequestError('User already exists');
    }
    return await this.addUserToDatabase(name, email, password);
  }

  async addUserToDatabase(name, email, password) {
    // Get users gravatar
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm',
    });

    const user = new User({ name, email, avatar, password });
    user.password = await this.encryptPassword(password);
    await user.save();
    return await tokenUtils.generateAndUpdateAccessAndRefreshToken(user._id);
  }

  async encryptPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}

module.exports = new UserService();
