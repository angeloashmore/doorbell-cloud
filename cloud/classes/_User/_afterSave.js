const Stripe = require('cloud/lib/stripe');

Parse.Cloud.afterSave(Parse.User, function(request) {
  var user = request.object;

  if (!user.existed()) createBilling(user);
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

    billing.set("relationship", {
      "__type": "Pointer",
      "className": "User",
      "objectId": user.id
    });
    billing.set("stripeCustomerId", stripeCustomer.id);

    billing.save()
      .fail(function(error) {
        return Parse.Promise.error("Billing could not be saved. Error: " + error);
      });

  }, function(error) {
    console.error(error);
  });
}
