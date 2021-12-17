const { BadRequestError } = require('../exception');

const userValidate = {
  validateEmail: (email) => {
    if (!email) return false;

    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  },
  validatePhone: (phone) => {
    if (!phone) return false;
    const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;

    return regex.test(phone);
  },
  validateUsername: function (username) {
    if (
      !username ||
      (!this.validateEmail(username) && !this.validatePhone(username))
    )
      return false;

    return true;
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
  validateLogin: function (username, password) {
    if (!this.validateUsername(username) || !this.validateExist(password))
      throw new BadRequestError('Invalid Credentials');
  },
  validateSignup: function (name, username, password) {
    if (
      !this.validateExist(name) ||
      !this.validateUsername(username) ||
      !this.validatePassword(password)
    )
      throw new BadRequestError('Invalid Information');
  },
};

module.exports = userValidate;
