const { userValidate } = require('../../validate');
const { tokenUtils, commonUtils } = require('../../utils');
const { AuthenError, BadRequestError } = require('../exception');
const User = require('./model');
const gravatar = require('gravatar');
const config = require('config');
const axios = require('axios');
const accountSid = 'ACe03c7667f84c55320d87b53a9b5aa5e7';
const authToken = '0d4dd9de6506eaf2883e7e640219ef55';
const smsSID = 'MG757cd2fb9f4edcb63064c20d716b9244';
const twilioClient = require('twilio')(accountSid, authToken);

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
     * [POST] /verify-phone
     * @param {string} phone
     * @returns {Promise}
     */
    async verifyPhone(phone) {
        const user = await User.findOne({ phone });
        if (!user) await this.createUserWithPhone(phone);
        else if (user.isActive) {
            throw new BadRequestError(
                'This phone number is already in use with another account',
            );
        }
        this.sendOTP(phone);
    }

    /**
     * send OTP
     * @param {string} phone
     * @returns {Promise}
     */
    async sendOTP(phone) {
        const otp = commonUtils.getRandomOTP();
        await User.updateOne({ phone }, { otp });

        // await twilioClient.messages.create({
        //     body: `Zalo: Ma OTP cua ban la: ${otp}. KHONG chia se ma OTP duoi bat ky hinh thuc nao. `,
        //     messagingServiceSid: smsSID,
        //     to: phone,
        // });
    }

    /**
     * Create new User when verify
     * @param {string} dbOtp
     * @param {string} code
     * @returns {Promise}
     */
    async createUserWithPhone(phone) {
        // Get users gravatar
        const avatar = gravatar.url(phone, {
            s: '200',
            r: 'pg',
            d: 'mm',
        });
        const user = new User({ phone, avatar, isActive: false });
        await user.save();
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
    async register(username, code, phone, password, source) {
        userValidate.validateRegister(username, phone, password);
        const user = await User.findOne({ phone });
        if (!user) {
            throw new BadRequestError('Invalid phone number');
        } else if (user.isActive) {
            throw new BadRequestError('User already exists');
        }
        await this.verifyOTP(user.otp, code);
        const { accessToken, refreshToken } = await this.addRegisterUser(
            user._id,
            username,
            password,
            source,
        );

        return { user, accessToken, refreshToken };
    }

    /**
     * Verify OTP
     * @param {string} dbOtp
     * @param {string} code
     * @returns {Promise}
     */
    async verifyOTP(dbOtp, code) {
        if (!code || code !== dbOtp) throw new BadRequestError('Invalid OTP code');
    }

    /**
     * Add User Info when register
     * @param {string} _id
     * @param {string} username
     * @param {string} password
     * @param {string} source
     * @returns {Promise}
     */
    async addRegisterUser(_id, username, password, source) {
        password = await commonUtils.encryptPassword(password);
        await User.updateOne({ _id }, {
            username,
            password,
            isActive: true,
        }, );
        const { accessToken, refreshToken } =
        await tokenUtils.generateAndUpdateAccessAndRefreshToken(_id, source);
        return { accessToken, refreshToken };
    }
}

module.exports = new AuthService();