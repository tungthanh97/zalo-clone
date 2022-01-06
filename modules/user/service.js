const { userValidate } = require('../../validate');
const { tokenUtils } = require('../../utils');
const User = require('../auth/model');
const bcrypt = require('bcryptjs');
const { BadRequestError } = require('../exception');
const gravatar = require('gravatar');

class UserService {}

module.exports = new UserService();
