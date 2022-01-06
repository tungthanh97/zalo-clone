const jwt = require('jsonwebtoken');
const { BadRequestError } = require('../modules/exception');
const User = require('../modules/auth/model');
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

  async generateAndUpdateAccessAndRefreshToken(_id, source) {
    const accessToken = await this.generateToken({ _id }, accessTokenLife);
    const refreshToken = await this.generateToken({ _id }, refreshTokenLife);
    await User.updateOne({ _id }, { $pull: { refreshTokens: { source } } });
    await User.updateOne(
      { _id },
      { $push: { refreshTokens: { token: refreshToken, source } } },
    );

    return {
      accessToken,
      refreshToken,
    };
  },

  verifyToken: async (token) => {
    if (!token) return new BadRequestError('Token invalid');

    return jwt.verify(token, jwtSecret);
  },
};

module.exports = tokenUtils;
