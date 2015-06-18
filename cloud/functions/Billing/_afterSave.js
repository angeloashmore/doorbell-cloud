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

  return Parse.Promise.as().then(function() {
    const user = billing.get("user");
    const organization = billing.get("organization");

    if (!!user) {
      const acl = new Parse.ACL(user);
      billing.setACL(acl);
      return billing.save();

    } else if (!!organization) {
      const roleName = organizationRoleName(organization, "billing");
      const query = new Parse.Query(Parse.Role);
      query.equalTo("name", roleName);
      return query.first().then(function(billingRole) {
        const acl = new Parse.ACL();
        acl.setReadAccess(billingRole, true);
        acl.setWriteAccess(billingRole, true);
        billing.setACL(acl);
        return billing.save();
      });
    }

  }, function(error) {
    console.error(error);
  });
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
