var passport  = require('passport');
var db = require('../db/index.js');
var environment = process.env.NODE_ENV || 'development';
var config = require('./oauth-config')[environment];
var strategy = {
  local       : require('passport-local').Strategy,
  facebook    : require('passport-facebook').Strategy,
  // google      : require('passport-google-oauth').OAuth2Strategy,
  // github      : require('passport-github').Strategy,
  // vimeo       : require('passport-vimeo-oauth2').Strategy,
  // instagram   : require('passport-instagram').Strategy,
  // linkedin    : require('passport-linkedin-oauth2').Strategy,
  // foursquare  : require('passport-foursquare').Strategy,
  // reddit      : require('passport-reddit').Strategy
};

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use('local', new strategy.local(
 // This is the callback function it will be passed the email and
 // password that have been submited.
 function (username, password, done) {
  // We need to look up the user by email address
    var sqlquery = "SELECT * FROM tbl_users WHERE username = ? AND provider = 'local'";
    db.query(sqlquery, username, function (err, data) {
    if( err ) {
      done(null, false, { message: 'Error' });
    } else {
      var user = data[0];
      if( user.password !== password ) {
        done(null, false, {message: 'Invalid password'});
      } else {
        done(null, user, {message: 'Log in sucessful'}); 
      }
    }
  });
  }
));

function StrategyGenerator (provider) {
    function findOrCreateUser (accessToken, refreshToken, profile, done) {
        // find the user in the database based on their [provider] id
        var profile_id = profile.id;
        var sqlquery = "SELECT * FROM tbl_users WHERE provider = ? AND profile_id = ?";
        
            db.query(sqlquery, [provider, profile_id], function(err, data) {
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err) {
                  return done(err);
                }
                else {
                  user = data[0];
                }

                // if the user is found, then log them in
                if (user) {
                    if (user.token !== accessToken){
                      var sqlquery = "UPDATE tbl_users SET token=? WHERE provider = ? AND profile_id = ?";
                      db.query(sqlquery, [accessToken, provider, profile_id], function(err, data){
                        return done(null, user);
                      });
                    } else {
                      return done(null, user);
                    }
                } 
                else {
                    if (!!profile.name && typeof profile.name === 'object') {
                        profile.name = profile.name.givenName || 'John Doe'
                    }
                    // if there is no user found with that [provider] id, create them
                    var newUser = {};
                    newUser.provider = provider;
                    newUser.password = "";
                    newUser.email = "";
                    // set all of the [provider] information in our user model
                    newUser.id    = profile.id; // set the users [provider] id
                    newUser.token = accessToken; // we will save the token that [provider] provides to the user
                    newUser.username  = profile.displayName || profile.username 
                                              || profile.name || profile.name.givenName || 'John Doe';
                    newUser.firstName = profile._json.first_name || '';
                    newUser.lastName = profile._json.last_name || '';
                    newUser.age = parseInt(profile._json.age_range.min);
                                              
                    if (profile.emails && profile.emails[0]) {
                        newUser.email = profile.emails[0].value; // [provider] can return multiple emails so we'll take the first    
                    }
                    // save our user to the database
                    var sqlquery = "INSERT INTO tbl_users (username, password, provider, token, email, profile_id, first_name, last_name, age) VALUES (?,?,?,?,?,?,?,?,?)";
                    db.query(sqlquery, [newUser.username, newUser.passowrd, newUser.provider, newUser.token, newUser.email, newUser.id, newUser.firstName, newUser.lastName, newUser.age], function(err) {
                      if (err) {
                          return done(err);
                      }
                      // if successful, return the new user
                      return done(null, newUser);
                    });
                }
            });
        }   

    return new strategy[provider](config['' + provider], findOrCreateUser);
}

passport.use(StrategyGenerator('facebook'));

// passport.use(StrategyGenerator('google'))

// passport.use(StrategyGenerator('github'))

// passport.use(StrategyGenerator('linkedin'))

// passport.use(StrategyGenerator('reddit'))

// passport.use(StrategyGenerator('vimeo'))

// passport.use(StrategyGenerator('instagram'))

// passport.use(StrategyGenerator('foursquare'))

module.exports = passport;