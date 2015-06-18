const Billing = require("cloud/classes/Billing");

Parse.Cloud.afterSave(Billing, function(request) {
  var billing = request.object;

  if (!billing.existed()) {
    billing.configureDefaultACL();
    billing.createStripeCustomer()
      .then(function() {
        billing.configureDefaultPlan();
      });
  }
});
