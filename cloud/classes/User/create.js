const Stripe = require('cloud/ext_modules').Stripe;

Parse.Cloud.define("User__create", function(request, response) {
  var user;

  Parse.Promise.as().then(function() {
    user = new Parse.Object(Parse.User);

    user.set("username", request.params.username);
    user.set("password", request.params.password);
    user.set("email", request.params.email);
    user.set("name", request.params.name);

    return user.signUp()
      .fail(function(error) {
        return Parse.Promise.error('User could not be created. Error: ' + error.message);
      });

  }).then(function() {
    return Stripe.Customers.create({
      email: user.get("email"),
      metadata: {
        parseUserId: user.id
      }
    }).fail(function(error) {
      console.log("Creating the customer with Stripe failed. Error: " + error);
      return Parse.Promise.error('An error has occured.');
    });

  }).then(function(stripeCustomer) {
    var billing = new Parse.Object("Billing");
    billing.set("stripeCustomerId", stripeCustomer.id)

    user.set("billing", billing);

    user.save()
      .fail(function(error) {
        return Parse.Promise.error("User could not be updated. Error: " + error.message);
      })

  }).then(function(user) {
    response.success(user);

  }, function(error) {
    response.error(error);
  });
});

