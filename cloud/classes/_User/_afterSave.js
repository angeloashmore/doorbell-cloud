const Stripe = require('cloud/lib/stripe');

Parse.Cloud.afterSave(Parse.User, function(request) {
  var user = request.object;

  if (!user.existed()) createBilling(user);
});

function createBilling(user) {
  Parse.Cloud.useMasterKey();

  return Parse.Promise.as().then(function() {
    var billing = new Parse.Object("Billing");

    billing.set("email", user.email);
    billing.set("relationship", {
      "__type": "Pointer",
      "className": "User",
      "objectId": user.id
    });

    return billing.save()
      .fail(function(error) {
        return Parse.Promise.error("Billing could not be saved. Error: " + error);
      });

  }, function(error) {
    console.error(error);
  });
}
