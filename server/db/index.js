var mysql = require('mysql');


// watsi db connect1ion
var pool = mysql.createPool({
  user     : 'bbc7e60c3989f8',
  password : '1a7e2b2c',
  database : 'heroku_a2c8f3fe6dd77f1',
  host: 'us-cdbr-iron-east-03.cleardb.net'
});

// export the db connection
module.exports = pool;
