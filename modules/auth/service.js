const { userValidate } = require('../../validate');
const { tokenUtils, commonUtils } = require('../../utils');
const { AuthenError, BadRequestError } = require('../exception');
const User = require('./model');
const gravatar = require('gravatar');

class AuthService {
    /**
     * [POST] /login
     * @param {string} phone
     * @param {string} password
     * @param {string} source
     * @returns {Promise}
     */
    async login(phone, password, source) {
        userValidate.validateLogin(phone, password);

        let user = await User.findOne({ phone });
        return await tokenUtils.generateAndUpdateAccessAndRefreshToken(
            user._id,
            source,
        );
    }

    /**
     * [POST] /refreshToken
     * @param {string} refreshToken
     * @param {string} source
     * @returns {Promise}
     */
    async refreshToken(refreshToken, source) {
        const { _id } = await tokenUtils.verifyToken(refreshToken);
        return await this.checkAndGenerateToken(_id, refreshToken, source);
    }

    /**
     * Check if token valid and generate, update accessToken, refreshToken
     * @param {string} refreshToken
     * @param {string} source
     * @returns {Promise}
     */
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

    /**
     * [POST] /register
     * @param {string} username
     * @param {string} code
     * @param {string} phone
     * @param {string} password
     * @param {string} source
     * @returns {Promise}
     */
    async register(username, phone, password, source) {
        userValidate.validateRegister(username, phone, password);
        const user = await User.findOne({ phone });
        // if (user) {
        //     throw new BadRequestError('User already exists');
        // }

        return await this.addUserToDatabase(username, phone, password, source);
    }

    /**
     * Add User to database
     * @param {string} _id
     * @param {string} username
     * @param {string} password
     * @param {string} source
     * @returns {Promise}
     */
    async addUserToDatabase(username, phone, password, source) {
        // Get users gravatar
        const avatar = gravatar.url(phone, {
            s: '200',
            r: 'pg',
            d: 'mm',
        });

        const user = new User({ username, phone, avatar, password });
        user.password = await commonUtils.encryptPassword(user.password);
        await user.save();
        const { accessToken, refreshToken } =
        await tokenUtils.generateAndUpdateAccessAndRefreshToken(user._id, source);
        return { user, accessToken, refreshToken };
    }
}

module.exports = new AuthService();