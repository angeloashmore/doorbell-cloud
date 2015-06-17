const Stripe = require('cloud/lib/stripe');

const RoleNames = {
  owner: "owner",
  admin: "admin",
  billing: "billing",
  member: "member"
};

Parse.Cloud.afterSave("Organization", function(request) {
  var organization = request.object;

  if (!organization.existed()) {
    createRoles(organization).then(function(roles) {
      setRoleHierachy(roles);
      setRoleACLs(roles);
    });

    setACL(organization);

    createBilling(organization);
  }
});

function setACL(organization) {
  const query = new Parse.Query(Parse.Role);
  query.equalTo("name", organization.id + "__" + RoleNames.admin);
  query.first().then(function(adminRole) {
    const acl = new Parse.ACL();
    acl.setReadAccess(adminRole);
    acl.setWriteAccess(adminRole);
    billing.setACL(acl);
  });
}

function createBilling(organization) {
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

function createRoles(organization) {
  Parse.Cloud.useMasterKey();

  var roles = {};

  return Parse.Promise.as().then(function() {
    const name = organization.id + "__" + RoleNames.owner;
    const role = new Parse.Role(name, new Parse.ACL());
    return role.save();

  }).then(function(ownerRole) {
    roles.owner = ownerRole;

    const name = organization.id + "__" + RoleNames.admin;
    const role = new Parse.Role(name, new Parse.ACL());
    return role.save();

  }).then(function(adminRole) {
    roles.admin = adminRole;

    const name = organization.id + "__" + RoleNames.billing;
    const role = new Parse.Role(name, new Parse.ACL());
    return role.save();

  }).then(function(billingRole) {
    roles.billing = billingRole;

    const name = organization.id + "__" + RoleNames.member;
    const role = new Parse.Role(name, new Parse.ACL());
    return role.save();

  }).then(function(memberRole) {
    roles.member = memberRole;

    return roles;

  }, function(error) {
    console.error(error);
  });
}

function setRoleHierachy(roles) {
  return Parse.Promise.as().then(function() {
    roles.owner.getRoles().add([roles.admin, roles.billing]);
    roles.owner.save()

  }).then(function() {
    roles.admin.getRoles().add(roles.member);
    roles.admin.save()

  }, function(error) {
    console.error(error);
  });
}

function setRoleACLs(roles) {
  return Parse.Promise.as().then(function() {
    _setRoleACLToSelf(role.owner);
    _setRoleACLToSelf(role.admin, true, false);
    _setRoleACLToSelf(role.billing, true, false);
    _setRoleACLToSelf(role.member, true, false);

  }, function(error) {
    console.error(error);
  });
}

function _setRoleACLToSelf(role, readAccess, writeAccess) {
  if (readAccess === undefined) readAccess = true;
  if (writeAccess === undefined) writeAccess = true;

  const acl = new Parse.ACL();
  if (readAccess) acl.setReadAccess(role);
  if (writeAccess) acl.setWriteAccess(role);
  role.setACL(acl);
}
