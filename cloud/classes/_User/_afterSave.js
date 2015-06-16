const Stripe = require('cloud/lib/stripe');

Parse.Cloud.afterSave(Parse.User, function(request) {
  var user = request.object;

  if (!user.existed()) createBilling(user);
});

function createBilling(user) {
  Parse.Cloud.useMasterKey();

  Parse.Promise.as().then(function() {
    var billing = new Parse.Object("Billing");

    billing.set("email", user.get("email"));
    billing.set("relation", {
      "__type": "Pointer",
      "className": "_User",
      "objectId": user.id
    });

    billing.save()
      .fail(function(error) {
        return Parse.Promise.error("Billing could not be saved. Error: " + error);
      });

  }, function(error) {
    console.error(error);
  });
}
