var stripe = require("stripe")("sk_test_kUZx8GbhTLwOQsvu0Tou6py8");

module.exports = function(router) {

  router.route('/')
    .post(function(req, res) {
      var stripeToken = req.body.id;
      console.log(stripeToken);

      var charge = stripe.charges.create({
        amount: 1000, // amount in cents, again
        currency: "usd",
        source: stripeToken,
        description: "Example charge"
      }, function(err, charge) {
        if (err && err.type === 'StripeCardError') {
          // The card has been declined
        } else {
          res.send(charge);
        }
      });
    });
}
