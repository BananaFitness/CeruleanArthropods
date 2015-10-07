var userController = require('./userController');

module.exports = function (router) {
  // Routes to specific controller methods
  router.post('/signup', userController.signup);
  router.get('/signedin', userController.checkAuth);
};
