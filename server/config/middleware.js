var morgan = require('morgan');
var bodyParser = require('body-parser');
var passport  = require('../auth/passport');
var authHelpers = require('../auth/authHelpers');

module.exports = function (app, express) {

  var patientRouter = express.Router();
  var donationRouter = express.Router();
  var conditionRouter = express.Router();
  var userRouter = express.Router();
  var stripeRouter = express.Router();
  var authRouter = express.Router();

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000/');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-AUTHENTICATION, X-IP, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);
    next();
  });

//Serve up static files in client folder and other middleware
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));

//Initailze passport
  app.use(passport.initialize());

  app.use(function (req, res, next) {
    console.log('==========================================');
    console.log(req.method + ': ' + req.url);
    next();
  });

//Routes traffic to their router and injects the router into its route file
  // app.use('/classes/patients', authHelpers.checkUser, patientRouter);
  app.use('/classes/patients', patientRouter);
  require('../patients/patientRoutes')(patientRouter);

  app.use('/classes/donations', authHelpers.checkUser, donationRouter);
  require('../donations/donationRoutes')(donationRouter);

  app.use('/classes/conditions', conditionRouter);
  // app.use('/classes/conditions', authHelpers.checkUser, conditionRouter);
  require('../conditions/conditionRoutes')(conditionRouter);

  app.use('/classes/users', userRouter);
  require('../users/userRoutes')(userRouter);

  app.use('/classes/stripe', stripeRouter);
  require('../stripe/stripeRoutes')(stripeRouter);

  app.use('/auth', authRouter);
  require('../auth/authRoutes')(authRouter);
};
