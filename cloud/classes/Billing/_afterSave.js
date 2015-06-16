const Stripe = require('cloud/lib/stripe');

Parse.Cloud.afterSave("Billing", function(request) {
  var billing = request.object;

  if (!billing.existed()) createAndSetStripeCustomer(billing);
});

function createAndSetStripeCustomer(billing) {
  Parse.Cloud.useMasterKey();

  Parse.Promise.as().then(function() {
    return Stripe.Customers.create({
      email: billing.get("email"),
      metadata: {
        parseBillingId: billing.id
      }
    }).fail(function(error) {
      return Parse.Promise.error("Creating the customer with Stripe failed. Error: " + error);
    });

  }).then(function(stripeCustomer) {
    billing.set("stripeCustomerId", stripeCustomer.id);
    billing.save()
      .fail(function(error) {
        return Parse.Promise.error("Billing could not be saved. Error: " + error);
      });

  }, function(error) {
    console.error(error);
  });
}
