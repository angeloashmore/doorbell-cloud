const Organization = require("cloud/classes/Organization");

Parse.Cloud.afterSave(Organization, function(request) {
  const organization = request.object;
  const user = request.user;

  if (!organization.existed()) {
    organization.createRoles()
      .then(function() {
        organization.configureDefaultACL();
        organization.createBilling();
        organization.addUser(user, Organization.RoleTypes.Owner);
      }, function(error) {
        console.error(error);
      });
  }
});
