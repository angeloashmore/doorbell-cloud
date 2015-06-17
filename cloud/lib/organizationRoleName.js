const RoleNames = {
  "owner": "owner",
  "admin": "admin",
  "billing": "billing",
  "member": "member"
}

const organizationRoleName = function(organization, name) {
  return [organization.id, RoleNames[name]].join("__");
}

module.exports = organizationRoleName;
