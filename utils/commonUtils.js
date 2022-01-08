const bcrypt = require('bcryptjs');

const commonUtils = {
    /**
     * Generate random OTP
     * @returns {int}
     */
    getRandomOTP: function() {
        return this.getRandomInt(100000, 999999);
    },
    /**
     * Generate random number
     * @param {number} min
     * @param {number} max
     * @returns {int}
     */
    getRandomInt: (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    encryptPassword: async(password) => {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    },
};

module.exports = commonUtils;