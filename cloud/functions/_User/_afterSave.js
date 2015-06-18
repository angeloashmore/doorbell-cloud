const Stripe = require('cloud/lib/Stripe');

Parse.Cloud.afterSave(Parse.User, function(request) {
  const user = request.object;

  setACL(user);
  createBilling(user);
});

function setACL(user) {
  if (user.existed()) return;

  Parse.Cloud.useMasterKey();

  const acl = new Parse.ACL(user);
  user.setACL(acl);
}

function createBilling(user) {
  if (user.existed()) return;

  Parse.Cloud.useMasterKey();

  return Parse.Promise.as().then(function() {
    const billing = new Parse.Object("Billing");
    billing.set("email", user.get("email"));
    billing.set("user", user);
    return billing.save()
      .fail(function(error) {
        return Parse.Promise.error("Billing could not be saved. Error: " + error);
      });

  }).fail(function(error) {
    console.error(error);
  });
}
