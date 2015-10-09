var jwt = require('jsonwebtoken');
var db = require('../db/index.js');
var secret = 'this is a secret';

module.exports.signup = function (req, res) {

  // Inserts into SQL database.  If successful, responds with token.  Else, send 404.
  var sqlquery = "INSERT INTO tbl_users (username, password) VALUES (?,  ?)";

  var user = {
    username: req.body.username,
    password: req.body.password
  };

  db.query(sqlquery, [req.body.username, req.body.password], function (err, data){
    if (err) {
      res.status(404).send('Error: signup failed. ' + err);
    } else {
      //var token = jwt.sign(jwtTokenBody, secret, { expiresIn: 60*60*5 });
      //res.redirect('/#/jwt?token=' + token);
      res.end();
    }
  });
};

module.exports.checkAuth = function (req, res) {
  // Checks request for token and attempts to decode
  var token = req.headers['x-access-token'];
  if (!token) {
    res.sendStatus(404);
  } else {
    var user = jwt.verify(token, secret);
    // Queries for decoded user.  If found, returns 200. Else, sends 404 or 401.
    var sqlquery = "SELECT * FROM tbl_users WHERE username =? AND provider =?";
    db.query(sqlquery, [user.username, user.provider], function (err, data) {
      if (err) {
        res.status(404).send(err);
      } else {
        if (data.length === 0) {
          res.sendStatus(401);
        } else {
          res.sendStatus(200);   
        }
      }
    });
  }
};

module.exports.getCurrentUser = function (req, res) {
  var token = req.headers['x-access-token'];
  if (!token) {
    res.sendStatus(404);
  } else {
    var tokenedUser = jwt.verify(token, secret);
    var userQuery = "SELECT * FROM tbl_users WHERE username =? AND provider =?";
    db.query(userQuery, [tokenedUser.username, tokenedUser.provider], function (err, data) {
      if (err) {
        res.status(404).send(err);
      } else {
        if (data.length === 0) {
          res.sendStatus(401);
        } else {
          var user = data[0];
          var fullUserQuery = "SELECT * FROM tbl_donations JOIN tbl_patients ON tbl_donations.patient_id=tbl_patients.id WHERE tbl_donations.donor_id=?";
          db.query(fullUserQuery, [user.id], function (err, data) {
            if (err) {
              res.status(404).send(err);
            } else {
              user['donations'] = data;
              res.status(200);   
              res.json(user);
            }
          });
        }
      }
    });
  }
}
