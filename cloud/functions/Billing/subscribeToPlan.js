const Stripe = require('cloud/lib/Stripe');

Parse.Cloud.define("Billing__subscribeToPlan", function(request, response) {
  var user = request.user;
  var id = request.params.id;
  var planId = request.params.planId;
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
    var query = new Parse.Query("Billing");
    return query.get(id)
      .fail(function(error) {
        return Parse.Promise.error("Billing could not be found. Error:" + error);
      });

  }).then(function(_billing) {
    billing = _billing;

    var query = new Parse.Query("Plan");
    return query.get(planId)
      .fail(function(error) {
        return Parse.Promise.error("Plan could not be found. Error:" + error);
      });

  }).then(function(_plan) {
    plan = _plan;

    var stripeCustomerId = billing.get("stripeCustomerId");
    var data = {
      plan: plan.get("stripePlanId")
    };

    return Stripe.Customers.updateSubscription(stripeCustomerId, data)
      .fail(function(error) {
        return Parse.Promise.error("Stripe Customer could not be updated. Error:" + error);
      });

  }).then(function(subscription) {
    billing.set("plan", plan);

    return billing.save()
      .fail(function(error) {
        return Parse.Promise.error("Billing could not be updated. Error:" + error);
      });

  }).then(function(billing) {
    response.success(billing);

  }, function(error) {
    response.error(error);
  });
});
