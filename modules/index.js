const { authRoute } = require('./auth');

module.exports = routes = (app) => {
  app.use('/api/auth', authRoute);
};
