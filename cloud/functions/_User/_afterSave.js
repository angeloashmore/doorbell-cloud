const Stripe = require('cloud/lib/stripe');

Parse.Cloud.afterSave(Parse.User, function(request) {
  const user = request.object;

  if (!user.existed()) {
    user.configureDefaultACL();
    user.createBilling();
  }
});
