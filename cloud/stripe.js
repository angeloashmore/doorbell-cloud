var Stripe = require('stripe');
Stripe.initialize('sk_test_QSGWG4k2CfgfD10hXdWVdOXc');

Parse.Cloud.define("createCustomer", function(request, response) {
  Parse.Promise.as().then(function() {
    // Find the plan.
    var planQuery = new Parse.Query('Plan');
    planQuery.equalTo('name', request.params.planName);

    // Find the results.
    return planQuery.first().then(null, function(error) {
      return Parse.Promise.error('Error: Plan could not be found');
    });

  }).then(function(result) {
    // Make sure we found a plan.
    if (!result) {
      return Parse.Promise.error('Error: Plan could not be found');
    }

    return result;

  }).then(function(result) {
    return Stripe.Customers.create({
      email: request.params.email,
      source: request.params.token,
      plan: result.stripeId
    }).then(null, function(error) {
      console.log("Creating the customer with Stripe failed. Error: " + error);
      return Parse.Promise.error('An error has occured. Your credit card was not charged.');
    });

  }).then(function(customer) {
    response.success('Success!');

  }, function(error) {
    response.error(error);
  });
});
