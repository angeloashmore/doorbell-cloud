const Billing = require("cloud/classes/Billing");
const Plan = require("cloud/classes/Plan");

Parse.Cloud.afterSave(Billing, function(request) {
  var billing = request.object;

  if (!billing.existed()) {
    billing.configureDefaultACL();
    billing.createStripeCustomer()
      .then(function() {
        return Plan.fetchDefaultPlanForType(billing.type());
      }).then(function(plan) {
        return billing.subscribeToPlan(plan);
      });
  }
});
