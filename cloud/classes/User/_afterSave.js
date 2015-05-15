const Stripe = require('cloud/ext_modules').Stripe;

Parse.Cloud.afterSave(Parse.User, function(request) {
  if (!request.object.existed()) createBilling(request.object);
});

function createBilling(user) {
  Parse.Cloud.useMasterKey();

  Parse.Promise.as().then(function() {
    return Stripe.Customers.create({
      email: user.get("email"),
      metadata: {
        parseUserId: user.id
      }
    }).fail(function(error) {
      return Parse.Promise.error("Creating the customer with Stripe failed. Error: " + error);
    });

  }).then(function(stripeCustomer) {
    var billing = new Parse.Object("Billing");
    billing.set("stripeCustomerId", stripeCustomer.id)

    user.set("billing", billing);

    user.save()
      .fail(function(error) {
        return Parse.Promise.error("User could not be updated. Error: " + error.message);
      })

  }, function(error) {
    console.error(error);
  });
}
