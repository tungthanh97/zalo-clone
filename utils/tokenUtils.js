const jwt = require('jsonwebtoken');
const { BadRequestError } = require('../exception');
const User = require('../modules/user/model');
const config = require('config');
const refreshTokenLife = config.get('JWT_LIFE_REFRESH_TOKEN');
const accessTokenLife = config.get('JWT_LIFE_ACCESS_TOKEN');
const jwtSecret = config.get('JWT_SECRET');

const tokenUtils = {
  generateToken: async (data, tokenLifetime) => {
    if (!data) return null;
    return await jwt.sign({ ...data, createdAt: new Date() }, jwtSecret, {
      expiresIn: tokenLifetime,
    });
  },
  async generateAndUpdateAccessAndRefreshToken(_id) {
    const token = await this.generateToken({ _id }, accessTokenLife);
    const refreshToken = await this.generateToken({ _id }, refreshTokenLife);
    await User.updateOne({ _id }, { $set: { name: 'test' } });
    return {
      token,
      refreshToken,
    };
  },
  verifyToken: async (token) => {
    if (!token) return new BadRequestError('Token invalid');

    return await jwt.verify(token, jwtSecret);
  },
};

module.exports = tokenUtils;
