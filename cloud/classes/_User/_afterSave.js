const Stripe = require('cloud/lib/stripe');

Parse.Cloud.afterSave(Parse.User, function(request) {
  var user = request.object;

  if (!user.existed()) {
    setACL(user);
    createBilling(user);
  }
});

function setACL(user) {
  Parse.Cloud.useMasterKey();

  const acl = new Parse.ACL(user);
  user.setACL(acl);
}

function createBilling(user) {
  Parse.Cloud.useMasterKey();

  return Parse.Promise.as().then(function() {
    const billing = new Parse.Object("Billing");
    billing.set("email", user.get("email"));
    billing.set("user", user);
    return billing.save()
      .fail(function(error) {
        return Parse.Promise.error("Billing could not be saved. Error: " + error);
      });

  }, function(error) {
    console.error(error);
  });
}
