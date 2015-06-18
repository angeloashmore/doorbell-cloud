const Organization = require("cloud/classes/Organization");

Parse.Cloud.afterSave(Organization, function(request) {
  const organization = request.object;
  const user = request.user;

  if (!organization.existed()) {
    Parse.Promise.as().then(function() {
      return organization.createRoles();
    }).then(function() {
      organization.setACL(organization.defaultACL());
      return organization.save();
    }).then(function() {
      organization.createBilling();
    }).then(function() {
      organization.addUser(user, Organization.RoleTypes.Owner);
    }, function(error) {
      console.error(error);
    });
  }
});
