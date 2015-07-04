const Enums = require("cloud/enums/Enums");
const Billing = require("cloud/classes/Billing");
const Profile = require("cloud/classes/Profile");
const validateRequiredAttrs = require("cloud/lib/validateRequiredAttrs");

const Team = Parse.Object.extend("Team", {
  // MARK: Instance properties
  requiredAttrs: [
    "name",
    "email"
  ],


  // MARK: Instance methods
  validate: function(attrs, options) {
    return validateRequiredAttrs(this.requiredAttrs, attrs);
  },

  defaultACL: function() {
    const acl = new Parse.ACL();
    acl.setRoleReadAccess(this.roleNameForType(Enums.RoleTypes.Member), true);
    acl.setRoleWriteAccess(this.roleNameForType(Enums.RoleTypes.Owner), true);
    return acl;
  },

  configureDefaultACL: function() {
    this.setACL(this.defaultACL());
    return this.save(null, { useMasterKey: true });
  },

  addUser: function(user, type, options) {
    const this_ = this;
    return this.findRoleForType(type, options).then(function(role) {
      role.getUsers().add(user);
      return role.save(null, options);

    }).then(function() {
      const profile = new Profile();
      profile.set({
        "user": user,
        "team": this_
      });
      return profile.save(null, { useMasterKey: true });

    }).then(function() {
      return this_;

    });
  },

  createRoles: function(options) {
    const roles = {};

    for (key in Enums.RoleTypes) {
      var type = Enums.RoleTypes[key];
      roles[type] = this._newRoleForType(type);
    }

    const rolesArray = Object.keys(roles).map(function(key) { return roles[key]; });
    return Parse.Object.saveAll(rolesArray, options)
      .then(function() {
        roles[Enums.RoleTypes.Member].getRoles().add([
          roles[Enums.RoleTypes.Admin],
          roles[Enums.RoleTypes.Owner]
        ]);
        roles[Enums.RoleTypes.Member].save(null, options);

        roles[Enums.RoleTypes.Admin].getRoles().add([
          roles[Enums.RoleTypes.Owner]
        ]);
        roles[Enums.RoleTypes.Admin].save(null, options);
      });
  },

  createBilling: function(options) {
    const billing = new Billing();
    billing.set({
      "team": this,
      "email": this.get("email")
    });
    return billing.save(null, options);
  },

  destroyAllChildren: function(options) {
    const this_ = this;
    var roles, profiles, billing;

    return this.findAllRoles(options)
      .then(function(roles_) {
        roles = roles_;

        return this_.findBilling(options);

      }).then(function(billing_) {
        billing = billing_;

        return this_.findAllProfiles(options);

      }).then(function(profiles_) {
        profiles = profiles_;

        Parse.Object.destroyAll(roles, options);
        Parse.Object.destroyAll(profiles, options);
        billing.destroy(options);

      });
  },

  roleNameForType: function(type) {
    return [this.id, type].join("__");
  },


  // MARK: Instance query methods
  findAllRoles: function(options) {
    const query = new Parse.Query(Parse.Role);
    query.equalTo("team", this);
    return query.find(options);
  },

  findRoleForType: function(type, options) {
    const query = new Parse.Query(Parse.Role);
    query.equalTo("name", this.roleNameForType(type));
    return query.first(options);
  },

  findBilling: function(options) {
    const query = new Parse.Query(Billing);
    query.equalTo("team", this);
    return query.first(options);
  },

  findAllProfiles: function(options) {
    const query = new Parse.Query(Profile);
    query.equalTo("team", this);
    return query.find(options);
  },


  // MARK: Instance private methods
  _newRoleForType: function(type) {
    const name = this.roleNameForType(type);
    const acl = this._newRoleACLForType(type);
    const role = new Parse.Role(name, acl);
    role.set("team", this);
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
  // MARK: Class methods
});

module.exports = Team;
