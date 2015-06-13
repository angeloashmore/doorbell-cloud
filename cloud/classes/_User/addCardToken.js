const Stripe = require('cloud/lib/stripe');

Parse.Cloud.define("User__addCardToken", function(request, response) {
  var user = request.user;
  var token = request.params.token;

  Parse.Promise.as().then(function() {
    // Check if a user was logged in.
    if (!user) {
      return Parse.Promise.error("User is not logged in");
    }

    // Check if a Stripe token was provided.
    if (!token) {
      return Parse.Promise.error("Stripe token was not provided");
    }

  }).then(function() {
    var billing = user.get("billing");
    return billing.fetch();

  }).then(function(billing) {
    var data = { source: token };
    return Stripe.Customers.update(billing.get("stripeCustomerId"), data)
      .then(function(customer) {
        return { billing: billing, customer: customer };
      })
      .fail(function(error) {
        return Parse.Promise.error("Stripe customer could not be updated. Error: " + error);
      });

  }).then(function(result) {
    var source = result.customer.sources.data[0];
    var billing = result.billing;

    billing.set("brand", source.brand);
    billing.set("last4", source.last4);
    billing.set("expMonth", source.exp_month);
    billing.set("expYear", source.exp_year);

    return billing.save()
      .fail(function(error) {
        return Parse.Promise.error("User could not be updated with card info. Error: " + error.message);
      });

  }).then(function() {
    response.success(user);

  }, function(error) {
    response.error(error);
  });
});
