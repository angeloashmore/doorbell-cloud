const validateRequiredColumns = require("cloud/lib/validateRequiredColumns");

const RequiredColumns = {
  "email": null
};

Parse.Cloud.beforeSave("Billing", function(request, response) {
  const billing = request.object;

  if (!billing.existed()) setACL(billing);

  validateRequiredColumns(billing, RequiredColumns).then(function() {
    response.success();
  }, function(error) {
    response.error(error);
  });
});

function setACL(billing) {
  Parse.Cloud.useMasterKey();

  if (!!billing.get("user")) {
    const acl = new Parse.ACL(billing.get("user"));
    billing.setACL(acl);
  } else if (!!billing.get("organization")) {
    const organization = billing.get(organization);
    const query = new Parse.Query(Parse.Role);
    query.equalTo("name", organization.id + "__billing");
    query.first().then(function(billingRole) {
      const acl = new Parse.ACL();
      acl.setReadAccess(billingRole);
      acl.setWriteAccess(billingRole);
      billing.setACL(acl);
    });
  }

  billing.setACL(acl);
}
