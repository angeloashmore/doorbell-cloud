const Stripe = require('cloud/ext_modules').Stripe;

Parse.Cloud.define("User__subscribeTo", function(request, response) {
  var user = request.user;
  var plan, billing;

  Parse.Promise.as().then(function() {
    // Validate user and params.
    if (!user) {
      return Parse.Promise.error("User is not logged in");
    }

    if (!request.params.planId) {
      return Parse.Promise.error("Plan ID was not provided");
    }

  }).then(function() {
    var Plan = Parse.Object.extend("Plan");
    var query = new Parse.Query(Plan);
    return query.get(request.params.planId)
      .fail(function(error) {
        return Parse.Promise.error("Plan could not be found. Error:" + error);
      });

  }).then(function(_plan) {
    plan = _plan;

    return request.user.get("billing").fetch()
      .fail(function(error) {
        return Parse.Promise.error("Billing info could not be found. Error:" + error);
      });

  }).then(function(_billing) {
    billing = _billing;

    var stripeCustomerId = billing.get("stripeCustomerId");
    var data = {
      plan: plan.get("stripePlanId")
    };

    return Stripe.Customers.updateSubscription(stripeCustomerId, data)
      .fail(function(error) {
        return Parse.Promise.error("Stripe Customer could not be updated. Error:" + error);
      });

  }).then(function(subscription) {
    user.set("plan", plan);

    return user.save()
      .fail(function(error) {
        return Parse.Promise.error("User could not be updated. Error:" + error);
      });

  }).then(function(user) {
    response.success(user);

  }, function(error) {
    response.error(error);
  });
});
