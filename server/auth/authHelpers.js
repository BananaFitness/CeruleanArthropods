var jwt = require('jsonwebtoken');
var db = require('../db/index.js');
var secret = 'this is a secret';

module.exports.checkUser = function(req,res,next){
    var token = req.headers['x-access-token'];
    if( !token ) {
      res.sendStatus(403);
    } else {
      var user = jwt.verify(token, secret);
      // Queries for decoded user.  If found, returns 200. Else, sends 404 or 401.
      var sqlquery = "SELECT * FROM tbl_users WHERE username =? AND provider =?";
      db.query(sqlquery, [user.username, user.provider], function (err, data) {
        if( err ) {
          res.sendStatus(403);
        } else {
          if( data.length === 0 ) {
            res.sendStatus(403);
          } else {
            next();   
          }
        }
      });
    }
};