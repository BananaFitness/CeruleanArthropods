var jwt = require('jsonwebtoken');
var passport = require('./passport');
var secret = 'this is a secret';

module.exports = function(router){
  
  var callBackFunctionGenerator = function (provider) {
    return function(req, res, next) {

      passport.authenticate(provider, function(err, user) {
        if (err) { return next(err); }

          if (!user) {
              return res.status(401).send('Could not find any user with that username');
          }

          var name = user.username;
          var provider = user.provider || 'local';
          console.log(provider, name);

          var jwtTokenBody = {
            id      : user._id,
            provider  : provider,
            username      : name
          };
          
          //user has authenticated correctly thus we create a JWT token
          var token = jwt.sign(jwtTokenBody, secret, { expiresIn: 60*60*5 });
          req.login(user, function(err){
            console.log('redirecting', token);
            res.redirect('/#/jwt?token=' + token);
          });

        })(req, res, next);
    };
  };

  router.post('/local', callBackFunctionGenerator('local'));

  router.get('/facebook', passport.authenticate('facebook'));
  router.get('/facebook/callback', callBackFunctionGenerator('facebook'));

};
