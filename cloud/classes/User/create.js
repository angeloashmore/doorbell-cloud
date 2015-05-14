const Stripe = require('cloud/ext_modules').Stripe;

Parse.Cloud.define("User__create", function(request, response) {
  Parse.Promise.as().then(function() {
    var user = new Parse.Object("_User");

    user.set("username", request.params.username);
    user.set("password", request.params.password);
    user.set("email", request.params.email);
    user.set("name", request.params.name);

    return user.signUp()
      .then(function(user) {
        return user;
      })
      .fail(function(error) {
        return Parse.Promise.error('User could not be created. Error: ' + error.message);
      });

  }).then(function(user) {
    return Stripe.Customers.create({
      email: user.get("email"),
      metadata: {
        parseUserId: user.id
      }
    }).then(function(stripeCustomer) {
      return { user: user, stripeCustomer: stripeCustomer };

    }).fail(function(error) {
      console.log("Creating the customer with Stripe failed. Error: " + error);
      return Parse.Promise.error('An error has occured.');
    });

  }).then(function(results) {
    var user = results.user;
    var stripeCustomer = results.stripeCustomer;
    var billing = new Parse.Object("Billing");

    billing.set("stripeCustomerId", stripeCustomer.id)

    user.set("billing", billing);

    user.save()
      .then(function(user) {
        response.success(user);
      })
      .fail(function(error) {
        return Parse.Promise.error("User could not be updated. Error: " + error.message);
      })

  }, function(error) {
    response.error(error);
  });
});

