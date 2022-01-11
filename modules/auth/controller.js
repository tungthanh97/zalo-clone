const authService = require('./service');
const { catchAsync } = require('../../utils/exceptionUtils');

class AuthController {
    /**
     * [POST] /login
     */
    login = catchAsync(async(req, res) => {
        const { phone, password } = req.body;
        const source = req.headers['user-agent'];

        const { accessToken, refreshToken } = await authService.login(
            phone,
            password,
            source,
        );
        res.json({ accessToken, refreshToken });
    });

    /**
     * [POST] /auto-login
     */
    autoLogin = catchAsync(async(req, res) => {
        const { _id, refreshToken } = req.body;
        const source = req.headers['user-agent'];

        const authResponse = await authService.checkAndGenerateToken(
            _id,
            refreshToken,
            source,
        );
        res.json(authResponse);
    });

    /**
     * [POST] /register
     */
    register = catchAsync(async(req, res) => {
        const { username, password, phone } = req.body;
        const source = req.headers['user-agent'];
        const authResponse = await authService.register(
            username,
            phone,
            password,
            source,
        );

        res.json(authResponse);
    });

    /**
     * [POST] /refresh-token
     */
    refreshToken = catchAsync(async(req, res) => {
        const { refreshToken: token } = req.body;
        const source = req.headers['user-agent'];

        const { accessToken, refreshToken } = await authService.refreshToken(
            token,
            source,
        );
        res.json({ accessToken, refreshToken });
    });
}

module.exports = new AuthController();