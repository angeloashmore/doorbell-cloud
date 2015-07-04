const Stripe = require("cloud/lib/stripe");
const Billing = require("cloud/classes/Billing");

Parse.Cloud.define("Billing__addCard", function(request, response) {
  const id = request.params.id;
  const token = request.params.token;
  var billing;

  Parse.Promise.as().then(function() {
    // Check if a Billing ID was provided.
    if (!id) return Parse.Promise.error("Billing ID was not provided");

    // Check if a Stripe token was provided.
    if (!token) return Parse.Promise.error("Stripe token was not provided");

  }).then(function() {
    const query = new Parse.Query(Billing);
    return query.get(id)
      .then(function(billing_) {
        billing = billing_;
      });

  }).then(function() {
    const stripeCustomerId = billing.get("stripeCustomerId");
    const data = { source: token };
    return Stripe.Customers.update(stripeCustomerId, data);

  }).then(function(customer) {
    const source = customer.sources.data[0];

    billing.set({
      "brand": source.brand,
      "last4": String(source.last4),
      "expMonth": String(source.exp_month),
      "expYear": String(source.exp_year)
    });
    return billing.save();

  }).then(function() {
    response.success(billing);

  }, function(error) {
    response.error(error);
  });
});
