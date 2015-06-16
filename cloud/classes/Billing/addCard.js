const Stripe = require('cloud/lib/stripe');

Parse.Cloud.define("Billing__addCard", function(request, response) {
  var user = request.user;
  var id = request.params.id;
  var token = request.params.token;
  var billing;

  Parse.Promise.as().then(function() {
    // Check if a user was logged in.
    if (!user) {
      return Parse.Promise.error("User is not logged in");
    }

    // Check if a Billing id was provided.
    if (!id) {
      return Parse.Promise.error("Billing id was not provided");
    }

    // Check if a Stripe token was provided.
    if (!token) {
      return Parse.Promise.error("Stripe token was not provided");
    }

  }).then(function() {
    var query = Parse.Query("Billing");
    return query.get(id);

  }).then(function(_billing) {
    billing = _billing;

    var data = { source: token };
    return Stripe.Customers.update(billing.get("stripeCustomerId"), data)
      .fail(function(error) {
        return Parse.Promise.error("Stripe customer could not be updated. Error: " + error);
      });

  }).then(function(customer) {
    var source = customer.sources.data[0];

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
