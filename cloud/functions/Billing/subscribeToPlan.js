const Stripe = require("cloud/lib/stripe");
const Billing = require("cloud/classes/Billing");
const Plan = require("cloud/classes/Plan");

Parse.Cloud.define("Billing__subscribeToPlan", function(request, response) {
  var id = request.params.id;
  var planId = request.params.planId;
  var plan, billing;

  Parse.Promise.as().then(function() {
    // Check if a Billing ID was provided.
    if (!id) return Parse.Promise.error("Billing ID was not provided");

    // Check if a Plan ID was provided.
    if (!planId) return Parse.Promise.error("Plan ID was not provided");

  }).then(function() {
    const query = new Parse.Query(Billing);
    return query.get(id)
      .then(function(billing_) {
        billing = billing_;
      });

  }).then(function() {
    const query = new Parse.Query(Plan);
    return query.get(planId)
      .then(function(plan_) {
        plan = plan_;
      });

  }).then(function() {
    if (billing.type() != plan.type()) throw new MismatchedBillingType();

    const stripeCustomerId = billing.get("stripeCustomerId");
    const data = { plan: plan.get("stripePlanId") };
    return Stripe.Customers.updateSubscription(stripeCustomerId, data);

  }).then(function() {
    billing.set("plan", plan);
    return billing.save();

  }).then(function(billing) {
    response.success(billing);

  }, function(error) {
    response.error(error);
  });
});
