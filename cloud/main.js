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
    var billing = user.get("billing");
    return billing.fetch();

  }).then(function(billing) {
    var data = { source: token };
    return Stripe.Customers.update(billing.get("stripeCustomerId"), data)
      .then(function(customer) {
        return { billing: billing, customer: customer };
      })
      .fail(function(error) {
        return Parse.Promise.error("Stripe customer could not be updated. Error: " + error);
      });

  }).then(function(result) {
    var source = result.customer.sources.data[0];
    var billing = result.billing;

    billing.set("brand", source.brand);
    billing.set("last4", source.last4);
    billing.set("expMonth", source.exp_month);
    billing.set("expYear", source.exp_year);

    return billing.save()
      .fail(function(error) {
        return Parse.Promise.error("User could not be updated with card info. Error: " + error.message);
      });

  }).then(function() {
    response.success(user);

  }, function(error) {
    response.error(error);
  });
});

Parse.Cloud.define("User__subscribeTo", function(request, response) {
  var user = request.user;
  var plan, billing;

  Parse.Promise.as().then(function() {
    // Validate user and params.
    if (!user) {
      return Parse.Promise.error("User is not logged in");
    }

    if (!request.params.planId) {
      return Parse.Promise.error("Plan ID was not provided");
    }

  }).then(function() {
    var Plan = Parse.Object.extend("Plan");
    var query = new Parse.Query(Plan);
    return query.get(request.params.planId)
      .fail(function(error) {
        return Parse.Promise.error("Plan could not be found. Error:" + error);
      });

  }).then(function(_plan) {
    plan = _plan;

    return request.user.get("billing").fetch()
      .fail(function(error) {
        return Parse.Promise.error("Billing info could not be found. Error:" + error);
      });

  }).then(function(_billing) {
    billing = _billing;

    var stripeCustomerId = billing.get("stripeCustomerId");
    var data = {
      plan: plan.get("stripePlanId")
    };

    return Stripe.Customers.updateSubscription(stripeCustomerId, data)
      .fail(function(error) {
        return Parse.Promise.error("Stripe Customer could not be updated. Error:" + error);
      });

  }).then(function(subscription) {
    user.set("plan", plan);

    return user.save()
      .fail(function(error) {
        return Parse.Promise.error("User could not be updated. Error:" + error);
      });

  }).then(function(user) {
    response.success(user);

  }, function(error) {
    response.error(error);
  });
});
