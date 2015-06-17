const Stripe = require('cloud/lib/stripe');
const organizationRoleName = require('cloud/lib/organizationRoleName');

Parse.Cloud.afterSave("Billing", function(request) {
  var billing = request.object;

  setACL(billing);
  createAndSetStripeCustomer(billing);
});

function setACL(billing) {
  if (billing.existed()) return;

  Parse.Cloud.useMasterKey();

  if (!!billing.get("user")) {
    const acl = new Parse.ACL(billing.get("user"));
    billing.setACL(acl);

  } else if (!!billing.get("organization")) {
    const organization = billing.get("organization");
    const roleName = organizationRoleName(organization, "billing");

    const query = new Parse.Query(Parse.Role);
    query.equalTo("name", roleName);
    query.first().then(function(billingRole) {
      const acl = new Parse.ACL();
      acl.setReadAccess(billingRole, true);
      acl.setWriteAccess(billingRole, true);
      billing.setACL(acl);
    });
  }
}

function createAndSetStripeCustomer(billing) {
  if (billing.existed()) return;

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
