const { BadRequestError } = require('../modules/exception');

const userValidate = {
    validatePhone: (phone) => {
        if (!phone) return false;
        const regex = /((84|0)[3|5|7|8|9])+([0-9]{8})\b/g;

        return regex.test(phone);
    },
    // không được trống, 8 <= size <=50
    validatePassword: (password) => {
        if (!password) return false;
        if (password.length < 8 || password.length > 50) return false;

        return true;
    },
    validateExist: (field) => {
        if (!field) return false;
        if ((field.length = 0)) return false;
        return true;
    },
    validateLogin: function(phone, password) {
        if (!this.validatePhone(phone) || !this.validateExist(password))
            throw new BadRequestError('Invalid Credentials');
    },
    validateRegister: function(username, phone, password) {
        if (!this.validatePhone(phone) ||
            !this.validateExist(username) ||
            !this.validatePassword(password)
        )
            throw new BadRequestError('Invalid Information');
    },
};

module.exports = userValidate;