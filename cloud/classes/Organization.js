const Billing = require("cloud/classes/Billing");
const validateRequiredAttrs = require("cloud/lib/validateRequiredAttrs");

const Organization = Parse.Object.extend("Organization", {
  // Instance methods
  requiredAttrs: [
    "name",
    "email"
  ],

  validate: function(attrs, options) {
    return validateRequiredAttrs(this.requiredAttrs, attrs);
  },

  configureDefaultACL: function() {
    Parse.Cloud.useMasterKey();

    const acl = new Parse.ACL();
    acl.setRoleReadAccess(this.roleNameForType(Organization.RoleTypes.Member), true);
    acl.setRoleWriteAccess(this.roleNameForType(Organization.RoleTypes.Owner), true);
    this.setACL(acl);
    return this.save();
  },

  addUser: function(user, type) {
    Parse.Cloud.useMasterKey();

    const this_ = this;
    return this.findRoleForType(type).then(function(role) {
      role.getUsers().add(user);
      role.save();

    }).then(function() {
      const profile = new Parse.Object("Profile");
      profile.set({
        "user": user,
        "organization": this_
      });
      return profile.save();

    });
  },

  findRoleForType: function(type) {
    const query = new Parse.Query(Parse.Role);
    query.equalTo("name", this.roleNameForType(type));
    return query.first();
  },

  roleNameForType: function(type) {
    return [this.id, type].join("__");
  },

  createRoles: function() {
    Parse.Cloud.useMasterKey();

    const roles = {};

    for (key in Organization.RoleTypes) {
      var type = Organization.RoleTypes[key];
      roles[type] = this._newRoleForType(type);
    }

    const rolesArray = Object.keys(roles).map(function(key) { return roles[key]; });
    return Parse.Object.saveAll(rolesArray)
      .then(function() {
        roles[Organization.RoleTypes.Owner].getRoles().add([
          roles[Organization.RoleTypes.Admin],
          roles[Organization.RoleTypes.Billing]
        ]);
        roles[Organization.RoleTypes.Owner].save();

        roles[Organization.RoleTypes.Admin].getRoles().add([
          roles[Organization.RoleTypes.Member]
        ]);
        roles[Organization.RoleTypes.Admin].save();
      });
  },

  createBilling: function() {
    Parse.Cloud.useMasterKey();

    const billing = new Billing();
    billing.set({
      "organization": this,
      "email": this.get("email")
    });
    return billing.save();
  },

  _newRoleForType: function(type) {
    const name = this.roleNameForType(type);
    const acl = this._newRoleACLForType(type);
    const role = new Parse.Role(name, acl);
    role.set("organization", this);
    return role;
  },

  _newRoleACLForType: function(type) {
    const acl = new Parse.ACL();

    switch (type) {
      case Organization.RoleTypes.Billing:
        acl.setRoleReadAccess(this.roleNameForType(Organization.RoleTypes.Member), true);
        acl.setRoleReadAccess(this.roleNameForType(Organization.RoleTypes.Billing), true);
        acl.setRoleWriteAccess(this.roleNameForType(Organization.RoleTypes.Owner), true);
        break;

      case Organization.RoleTypes.Member:
        acl.setRoleReadAccess(this.roleNameForType(Organization.RoleTypes.Member), true);
        acl.setRoleWriteAccess(this.roleNameForType(Organization.RoleTypes.Admin), true);
        break;

      default:
        acl.setRoleReadAccess(this.roleNameForType(Organization.RoleTypes.Member), true);
        acl.setRoleWriteAccess(this.roleNameForType(Organization.RoleTypes.Owner), true);
        break;
    }

    return acl;
  }

}, {
  // Class methods
  RoleTypes: Object.freeze({
    Owner: "owner",
    Admin: "admin",
    Billing: "billing",
    Member: "member"
  })
});

module.exports = Organization;
