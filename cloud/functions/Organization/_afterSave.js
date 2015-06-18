const Stripe = require('cloud/lib/stripe');
const organizationRoleName = require('cloud/lib/organizationRoleName');
const Organization = require("cloud/classes/Organization");

Parse.Cloud.afterSave(Organization, function(request) {
  const user = request.user;
  const organization = request.object;

  Parse.Promise.as().then(function() {
    return organization.createRoles();
  }).then(function() {
    organization.setACL(organization.defaultACL());
    return organization.save();
  }).then(function() {
    organization.createBilling();
  }).then(function() {
    // organization.addUser(user, Organization.RoleTypes.Owner);
  }, function(error) {
    console.error(error);
  });
});

function configureCallingUser(organization, roles, user) {
  if (organization.existed()) return;

  Parse.Cloud.useMasterKey();

  return Parse.Promise.as().then(function() {
    roles.owner.getUsers().add(user);
    return roles.owner.save();

  }).then(function() {
    const profile = new Parse.Object("Profile");
    profile.set("user", user);
    profile.set("organization", organization);
    return profile.save();

  }, function(error) {
    console.error(error);
  });
}
