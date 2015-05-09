var Stripe = require('stripe');
Stripe.initialize("sk_test_QSGWG4k2CfgfD10hXdWVdOXc");

Parse.Cloud.beforeSave(Parse.User, function(request, response) {
  if (!request.object.get("email")) {
    return response.error("email is required for signup");
  }

  if (!request.object.get("name")) {
    return response.error("name is required for signup");
  }

  response.success();
});

Parse.Cloud.define("User__create", function(request, response) {
  Parse.Promise.as().then(function() {
    var user = new Parse.User();
    user.set("username", request.params.username);
    user.set("password", request.params.password);
    user.set("email", request.params.email);
    user.set("name", request.params.name);

    return user.signUp()
      .fail(function(error) {
        return Parse.Promise.error('User could not be created. Error: ' + error.message);
      });

  }).then(function(user) {
    return stripeCustomer = Stripe.Customers.create({
      email: user.attributes.email,
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
    user.set("stripeCustomerId", results.stripeCustomer.id);
    user.save().then(function(user) {
      response.success(user);
    });

  }, function(error) {
    response.error(error);
  });
});

Parse.Cloud.define("User__addCardToken", function(request, response) {
  var user = request.user;
  var token = request.params.token;

  Parse.Promise.as().then(function() {
    // Check if a user was logged in.
    if (!user) {
      return Parse.Promise.error("User is not logged in");
    }

    // Check if a Stripe token was provided.
    if (!token) {
      return Parse.Promise.error("Stripe token was not provided");
    }

  }).then(function() {
    var data = {
      source: token
    };

    return Stripe.Customers.update(user.get("stripeCustomerId"), data)
      .then(function(customer) {
        return customer;
      })
      .fail(function(error) {
        return Parse.Promise.error("Stripe customer could not be updated. Error: " + error);
      });

  }).then(function(customer) {
    var source = customer.sources.data[0];

    user.set("billingBrand", source.brand);
    user.set("billingLast4", source.last4);

    user.save()
      .then(function(user) {
        response.success(user);
      })
      .fail(function(error) {
        return Parse.Promise.error("User could not be updated with card info. Error: " + error);
      });

  }, function(error) {
    response.error(error);
  });
});
