const Enums = require("cloud/enums/Enums");
const Billing = require("cloud/classes/Billing");
const Profile = require("cloud/classes/Profile");
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
    const acl = new Parse.ACL();
    acl.setRoleReadAccess(this.roleNameForType(Enums.RoleTypes.Member), true);
    acl.setRoleWriteAccess(this.roleNameForType(Enums.RoleTypes.Owner), true);
    this.setACL(acl);
    return this.save(null, { useMasterKey: true });
  },

  addUser: function(user, type) {
    const this_ = this;
    return this.findRoleForType(type).then(function(role) {
      role.getUsers().add(user);
      role.save(null, { useMasterKey: true });

    }).then(function() {
      const profile = new Parse.Object(Profile);
      profile.set({
        "user": user,
        "organization": this_
      });
      return profile.save(null, { useMasterKey: true });

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
    const roles = {};

    for (key in Enums.RoleTypes) {
      var type = Enums.RoleTypes[key];
      roles[type] = this._newRoleForType(type);
    }

    const rolesArray = Object.keys(roles).map(function(key) { return roles[key]; });
    return Parse.Object.saveAll(rolesArray, { useMasterKey: true })
      .then(function() {
        roles[Enums.RoleTypes.Owner].getRoles().add([
          roles[Enums.RoleTypes.Admin],
          roles[Enums.RoleTypes.Billing]
        ]);
        roles[Enums.RoleTypes.Owner].save(null, { useMasterKey: true });

        roles[Enums.RoleTypes.Admin].getRoles().add([
          roles[Enums.RoleTypes.Member]
        ]);
        roles[Enums.RoleTypes.Admin].save(null, { useMasterKey: true });
      });
  },

  createBilling: function() {
    const billing = new Billing();
    billing.set({
      "organization": this,
      "email": this.get("email")
    });
    return billing.save(null, { useMasterKey: true });
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
      case Enums.RoleTypes.Billing:
        acl.setRoleReadAccess(this.roleNameForType(Enums.RoleTypes.Member), true);
        acl.setRoleReadAccess(this.roleNameForType(Enums.RoleTypes.Billing), true);
        acl.setRoleWriteAccess(this.roleNameForType(Enums.RoleTypes.Owner), true);
        break;

      case Enums.RoleTypes.Member:
        acl.setRoleReadAccess(this.roleNameForType(Enums.RoleTypes.Member), true);
        acl.setRoleWriteAccess(this.roleNameForType(Enums.RoleTypes.Admin), true);
        break;

      default:
        acl.setRoleReadAccess(this.roleNameForType(Enums.RoleTypes.Member), true);
        acl.setRoleWriteAccess(this.roleNameForType(Enums.RoleTypes.Owner), true);
        break;
    }

    return acl;
  }

}, {
  // Class methods
});

module.exports = Organization;
