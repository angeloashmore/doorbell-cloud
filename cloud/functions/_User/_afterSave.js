const Stripe = require('cloud/lib/Stripe');

Parse.Cloud.afterSave(Parse.User, function(request) {
  const user = request.object;

  if (!user.existed()) {
    user.configureDefaultACL();
    user.createBilling();
  }
});
