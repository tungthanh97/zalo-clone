const { userRoute } = require('./user');
const { authRoute } = require('./auth');

module.exports = routes = (app) => {
  app.use('/api/users', userRoute);
  app.use('/api/auth', authRoute);
};
