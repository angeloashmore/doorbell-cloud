const Stripe = require('cloud/lib/stripe');
const organizationRoleName = require('cloud/lib/organizationRoleName');

Parse.Cloud.afterSave("Organization", function(request) {
  const user = request.user;
  const organization = request.object;

  createRoles(organization).then(function(roles) {
    setACL(organization, roles);
    return roles;

  }).then(function(roles) {
    setRoleACLs(organization, roles);
    setRoleHierachy(organization, roles);
    createBilling(organization);
    configureCallingUser(organization, roles, user);

  }, function(error) {
    console.error(error);
  });
});

function createRoles(organization) {
  if (organization.existed()) {
    return Parse.Promise.error("Organization already existed");
  }

  Parse.Cloud.useMasterKey();

  var roles = {};

  return Parse.Promise.as().then(function() {
    const name = organizationRoleName(organization, "owner");
    const role = new Parse.Role(name, new Parse.ACL());
    return role.save()
      .then(function(role) {
        roles.owner = role;
      });

  }).then(function() {
    const name = organizationRoleName(organization, "admin");
    const role = new Parse.Role(name, new Parse.ACL());
    return role.save()
      .then(function(role) {
        roles.admin = role;
      });

  }).then(function() {
    const name = organizationRoleName(organization, "billing");
    const role = new Parse.Role(name, new Parse.ACL());
    return role.save()
      .then(function(role) {
        roles.billing = role;
      });

  }).then(function() {
    const name = organizationRoleName(organization, "member");
    const role = new Parse.Role(name, new Parse.ACL());
    return role.save()
      .then(function(role) {
        roles.member = role;
      });

  }).then(function() {
    return roles;

  }, function(error) {
    console.error(error);
  });
}

function setACL(organization, roles) {
  if (organization.existed()) return;

  Parse.Cloud.useMasterKey();

  return Parse.Promise.as().then(function() {
    const acl = new Parse.ACL();

    acl.setReadAccess(roles.member, true);
    acl.setWriteAccess(roles.owner, true);

    organization.setACL(acl);
    return organization.save();

  }, function(error) {
    console.error(error);
  });
}

function setRoleACLs(organization, roles) {
  if (organization.existed()) return;

  Parse.Cloud.useMasterKey();

  return Parse.Promise.as().then(function() {
    const memberACL = new Parse.ACL();
    memberACL.setReadAccess(roles.member, true);
    memberACL.setWriteAccess(roles.admin, true);
    roles.member.setACL(memberACL);
    roles.member.save();

    const billingACL = new Parse.ACL();
    billingACL.setReadAccess(roles.member, true);
    billingACL.setReadAccess(roles.billing, true);
    billingACL.setWriteAccess(roles.owner, true);
    roles.billing.setACL(billingACL);
    roles.billing.save();

    const adminACL = new Parse.ACL();
    adminACL.setReadAccess(roles.member, true);
    adminACL.setWriteAccess(roles.owner, true);
    roles.admin.setACL(adminACL);
    roles.admin.save();

    const ownerACL = new Parse.ACL();
    ownerACL.setReadAccess(roles.member, true);
    ownerACL.setWriteAccess(roles.owner, true);
    roles.owner.setACL(ownerACL);
    roles.owner.save();

  }, function(error) {
    console.error(error);
  });
}

function setRoleHierachy(organization, roles) {
  if (organization.existed()) return;

  Parse.Cloud.useMasterKey();

  return Parse.Promise.as().then(function() {
    roles.owner.getRoles().add([roles.admin, roles.billing]);
    roles.owner.save()

    roles.admin.getRoles().add(roles.member);
    roles.admin.save()

  }, function(error) {
    console.error(error);
  });
}

function createBilling(organization) {
  if (organization.existed()) return;

  Parse.Cloud.useMasterKey();

  return Parse.Promise.as().then(function() {
    const billing = new Parse.Object("Billing");
    billing.set("email", organization.get("email"));
    billing.set("organization", organization);
    return billing.save()
      .fail(function(error) {
        return Parse.Promise.error("Billing could not be saved. Error: " + error);
      });

  }, function(error) {
    console.error(error);
  });
}

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
