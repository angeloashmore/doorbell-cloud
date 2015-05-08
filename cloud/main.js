var Stripe = require('stripe');
Stripe.initialize('sk_test_QSGWG4k2CfgfD10hXdWVdOXc');

Parse.Cloud.define("User__create", function(request, response) {
  Parse.Promise.as().then(function() {
    var user = new Parse.User();
    user.set("username", request.params.username);
    user.set("password", request.params.password);
    user.set("email", request.params.email);

    return user.signUp()
      .fail(function(error) {
        return Parse.Promise.error('User could not be created. Error: ' + error.message);
      });

  }).then(function(user) {
    return stripeCustomer = Stripe.Customers.create({
      email: user.attributes.email,
      metadata: {
        parseUserId: user.id
      }
    }).then(function(stripeCustomer) {
      return { user: user, stripeCustomer: stripeCustomer };

    }).fail(function(error) {
      console.log("Creating the customer with Stripe failed. Error: " + error);
      return Parse.Promise.error('An error has occured.');
    });

  }).then(function(results) {
    var user = results.user;
    user.set("stripeCustomerId", results.stripeCustomer.id);
    user.save().then(function(user) {
      response.success(user);
    });

  }, function(error) {
    response.error(error);
  });
});
